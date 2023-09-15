#!/usr/bin/env tsx
/**
 * Build images
 * Used CI Variables:
 *   - DOCKER_REG_SERVER
 *   - DOCKER_REG_USER
 *   - DOCKER_REG_PWD
 *   - NODE_BASE_IMAGE
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $ } from 'zx'

import { CI, CI_COMMIT_SHORT_SHA, CI_COMMIT_TAG, CI_JOB_MANUAL, baseDir } from './ci-consts.mjs'
import { getProjectPkgList } from './util/project-info.js'
import { join } from 'node:path'
import { BuildPackageOpts, buildPackage } from './util/docker.js'


await $`pwd && date`
const argv = retrieveArgsFromProcess()
const verbose = !! argv.verbose
verbose && console.info(argv)

let msg = `

-------------------------------------------
      images build and push process
-------------------------------------------
`
console.info(msg)


const baseImg: string = argv['base-img'] ?? process.env.NODE_BASE_IMAGE
assert(baseImg, 'Parameter of base-img invalid')

const dockerRegistry: string = argv['docker-reg'] ?? process.env.DOCKER_REG_SERVER
assert(dockerRegistry, 'Parameter of docker-reg invalid')

msg = `
CI_JOB_MANUAL: ${CI_JOB_MANUAL}
`
console.info(msg)

if (! CI_COMMIT_TAG && ! CI_COMMIT_SHORT_SHA) {
  assert(false, 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!')
}

await $`${baseDir}/.scripts/util/login-docker-repo.sh`

const globalIgnoreFile = join(baseDir, '.dockerignore')

CI && await $`nx reset`
const pkgs = await getProjectPkgList(baseDir)
assert(pkgs.length > 0, 'no packages found')

const publisher = process.env.authorOfTagOrCommit

for (const pkg of pkgs) {
  if (pkg.name.includes('demo-')) { continue }
  console.info(` \n\n----------------------- ${pkg.name} -----------------------\n`)
  const opts: BuildPackageOpts = {
    baseImg,
    dockerRegistry,
    globalIgnoreFile,
    publisher,
  }
  await buildPackage(pkg, opts)
}

msg = `
-------------------------------------------
      images build and push succeeded
-------------------------------------------\n\n
`
console.info(msg)

await $`${baseDir}/.scripts/util/image-random-prune.sh`


