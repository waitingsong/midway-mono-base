#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'
import { $ } from 'zx'

import {
  CI_COMMIT_REF_SLUG,
  VERSIONING_BRANCH_PREFIX,
  CI_PROJECT_PATH,
 } from '../ci-consts.mjs'

$.verbose = true
await $`pwd && date`

let msg = `
-------------------------------------------
            pre-versioning process
-------------------------------------------
`
console.info(msg)

await $`git remote -v`
assert(CI_PROJECT_PATH, 'no CI_PROJECT_PATH found')
assert(VERSIONING_BRANCH_PREFIX, 'no VERSIONING_BRANCH_PREFIX found')
assert(CI_COMMIT_REF_SLUG, 'no CI_COMMIT_REF_SLUG found')

const bumpBranchName = `${VERSIONING_BRANCH_PREFIX}${CI_COMMIT_REF_SLUG}`

let remoteBranchExists = false
try {
  const { stdout } = await $`git ls-remote --exit-code --heads origin ${bumpBranchName}`
  if (stdout && stdout.trim()) {
    remoteBranchExists = true
  }
}
catch {
  // not exists
  void 0
}

if (remoteBranchExists) {
  msg = `

---------------------------------- CAUTION -------------------------------------------
Remote repository already contains versioning branch "${bumpBranchName}" during pre-publish stage!
It seems another versioning process exists.
Wait until another versioning process completed or merge and delete branch origin/${bumpBranchName} manually.
git fetch origin && git checkout main && git merge main origin/${bumpBranchName}
--------------------------------------------------------------------------------------
    `
  console.error(msg)
  process.exit(1)
}

// await $`.scripts/ci/ci-ssh-agent.sh`
// source .scripts/util/verify-publish.sh

console.log('>>> Do deleting local release branch if exists...')
await $`git branch -a`
$.verbose = false
try {
  await $`git branch -D ${bumpBranchName} `
}
catch { void 0}
$.verbose = true


console.log('>>> Do creating a new versioning branch ...')
await $`git checkout -b ${bumpBranchName}`
await $`git log | head -n 1`.catch(() => void 0)

await $`.scripts/util/git-set-token.mts`

console.log('push to remote')
$.verbose = true
try {
  await $`git push -v origin ${bumpBranchName} `
}
catch {
  process.exit(1)
}

