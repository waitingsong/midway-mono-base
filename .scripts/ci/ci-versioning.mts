#!/usr/bin/env ts-node-esm
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'
import { $, sleep } from 'zx'

import {
  baseDir,
  CI_COMMIT_REF_NAME,
  GH_TOKEN,
  GL_TOKEN,
  GL_API_URL,
  NPM_LOG_LEVEL,
  PUBLISH_RELEASE_REPO,
 } from '../ci-consts.mjs'
import { PkgInfoLite } from '../ci-types.mjs'

$.verbose = true
await $`date`
// await $`nx reset`

let msg = `

-------------------------------------------
            versioning process
-------------------------------------------
`
console.info(msg)

const resp = await $`lerna ls --json`
const pkgs = JSON.parse(resp.stdout) as PkgInfoLite[]
assert(pkgs.length > 0, 'no packages found')

assert(PUBLISH_RELEASE_REPO, 'PUBLISH_RELEASE_REPO not set, gitlab or github')
switch (PUBLISH_RELEASE_REPO) {
  case 'gitlab': {
    const txt = `
Invalid GL_TOKEN for lerna version args '--create-release gitlab'
see: https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type
or branch is not protected
      `
    assert(GL_TOKEN, txt)
    assert(GL_API_URL, txt)
    process.env.GL_TOKEN = GL_TOKEN
    process.env.GL_API_URL = GL_API_URL
    break
  }

  case 'github': {
    const txt = `
Invalid GH_TOKEN for lerna publish args '--create-release github'
see: https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type
or branch is not protected
      `
    assert(GH_TOKEN, txt)
    process.env.GH_TOKEN = GH_TOKEN
    break
  }

  default:
    throw new Error(`unknown PUBLISH_RELEASE_REPO: ${PUBLISH_RELEASE_REPO}`)
}

await $`.scripts/util/git-set-token.mts`

await $`git -c core.fileMode=false checkout ${CI_COMMIT_REF_NAME}`
await $`git log | head -n 1`.catch(() => void 0)

await $`git remote -v \
  && git branch -a \
  && git push origin --no-verify
`

msg = '>>> lerna initializing...'
console.info(msg)

await $`nx reset`
await $`npm run clean:dist`
await $`date`
// await $`npm i --ci`
await $`npm i`
await $`npm run build`


msg = '>>> lerna version...'
console.info(msg)

const lockFile = `${baseDir}/package-lock.json`
const lockFileBackup = `${baseDir}/package-lock.json.publish_backup`
try {
  await $`test -f ${lockFile}`
  await $`mv -f ${lockFile} ${lockFileBackup}`
}
catch { void 0}

await $`git add --ignore-errors ./packages`
await $`git restore .scripts`
await $`git status`

const args: string[] = [
  '--yes',
  '--no-private',
  '--conventional-commits',
  '--loglevel', NPM_LOG_LEVEL,
]
await $`lerna version --create-release gitlab ${args}`

try {
  await $`test -f ${lockFileBackup}`
  await $`mv -f ${lockFileBackup} ${lockFile}`
}
catch { void 0}

// restore changed package.json (append gitHead)
await $`git restore ./packages`.catch(() => void 0)

await sleep('1s')
await $`git push --follow-tags origin`

