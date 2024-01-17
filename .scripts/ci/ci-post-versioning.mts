#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'
import { $ } from 'zx'

import {
  CI_COMMIT_REF_NAME,
  CI_COMMIT_BRANCH,
  CI_DEFAULT_BRANCH,
  CI_API_V4_URL,
  CI_PROJECT_ID,
  PUBLISH_TOKEN,
  VERSIONING_BRANCH_PREFIX,
 } from '../ci-consts.mjs'

$.verbose = true
await $`pwd && date`

let msg = `

-------------------------------------------
         post-versioning process
-------------------------------------------
`
console.info(msg)

assert(CI_COMMIT_BRANCH, 'no CI_COMMIT_BRANCH found')
assert(VERSIONING_BRANCH_PREFIX, 'no VERSIONING_BRANCH_PREFIX found')

const triggerBranchName = CI_COMMIT_BRANCH.replace(VERSIONING_BRANCH_PREFIX, '')
assert(triggerBranchName, 'triggerBranchName empty')
assert(
  CI_COMMIT_BRANCH !== CI_DEFAULT_BRANCH,
  `CI_COMMIT_BRANCH "${CI_COMMIT_BRANCH}" should not be CI_DEFAULT_BRANCH "${CI_DEFAULT_BRANCH}"`,
)

console.info(`triggerBranchName: ${triggerBranchName}`)

// check remote trigger branch exists
let remoteBranchExists = false
try {
  const { stdout } = await $`git ls-remote --exit-code --heads origin ${triggerBranchName}`
  if (stdout && stdout.trim()) {
    remoteBranchExists = true
  }
}
catch {
  // not exists
  void 0
}
assert(remoteBranchExists, `remote trigger branch "${triggerBranchName}" not exists`)

msg = '>>> Do Merging to trigger branch...'
console.info(msg)

await $`git config pull.rebase false \
  && git -c core.fileMode=false checkout ${triggerBranchName} \
  && git pull origin
`
try {
  await $`git merge ${CI_COMMIT_REF_NAME} -m "Merge release branch" `
}
catch {
  msg = `

-------------------------------------------
Merge versioning branch to trigger branch "${triggerBranchName}" failed!
Do merging manually!
-------------------------------------------\n\n
  `
  console.error(msg)
  assert(false)
}


// echo -e ">>> Do pushing local $CI_DEFAULT_BRANCH to remote..."
//
// if [ "$?" -ne 0 ]; then
//   echo -e "-------------------------------------------"
//   echo -e "Push local branch to remote failed!"
//   echo -e "Do merging manually!"
//   echo -e "-------------------------------------------\n\n"
//   exit 1
// fi
msg = `>>> Do pushing local trigger branch "${triggerBranchName}" to remote...`
console.info(msg)
try {
  await $`git push --no-verify -v origin`
}
catch {
  msg = `
-------------------------------------------
Push local trigger branch "${triggerBranchName}" to remote failed!
Do pushing manually!
-------------------------------------------\n\n
  `
  console.error(msg)
  assert(false)
}

const args: (string|number)[] = [
  '--token', PUBLISH_TOKEN,
  '--api-url', CI_API_V4_URL,
  '--pid', CI_PROJECT_ID,
  '--branch', CI_COMMIT_REF_NAME,
]
await $`.scripts/util/delete-remote-branch.mts ${args}`

await $`lerna run clean:cache`


