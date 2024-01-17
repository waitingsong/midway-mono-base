#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $, sleep } from 'zx'

import {
  baseDir,
  CI,
  CI_COMMIT_REF_NAME,
  GH_TOKEN,
  GL_TOKEN,
  GL_API_URL,
  NPM_LOG_LEVEL,
  PUBLISH_RELEASE_REPO,
  RELEASE_SEMVER,
 } from '../ci-consts.mjs'
import { PkgInfoLite, SemVerList } from '../ci-types.mjs'
import { getProjectPkgList } from '../util/project-info.js'

$.verbose = true
await $`date`

const argv = retrieveArgsFromProcess()
console.info(argv)

let semVer = argv.semver ?? RELEASE_SEMVER
if (semVer) {
  if (semVer === 'true' || semVer === true || semVer === '') {
    semVer = void 0
  }
  else {
    assert(Object.values(SemVerList).includes(semVer), `invalid semver: "${semVer}"`)
  }
}

let msg = `

-------------------------------------------
            versioning process
-------------------------------------------
`
console.info(msg)

const pkgs: PkgInfoLite[] = await getProjectPkgList(baseDir)
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

CI && await $`nx reset`
await $`lerna run clean:dist`
await $`date`
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
  '--create-release', PUBLISH_RELEASE_REPO,
  '--conventional-commits',
  '--loglevel', NPM_LOG_LEVEL,
]
if (semVer) {
  args.push(semVer)
}
console.info('lerna version args:', args.join(' '))
await $`lerna version ${args}`

try {
  await $`test -f ${lockFileBackup}`
  await $`mv -f ${lockFileBackup} ${lockFile}`
}
catch { void 0}

// restore changed package.json (append gitHead)
await $`git restore ./packages`.catch(() => void 0)
await $`lerna run clean:cache`

await sleep('1s')
await $`git push --follow-tags origin`

