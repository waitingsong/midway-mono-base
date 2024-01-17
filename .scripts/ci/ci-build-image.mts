#!/usr/bin/env tsx
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $, cd } from 'zx'

import {
  CI_COMMIT_BRANCH,
  CI_COMMIT_TAG,
  CI_DEFAULT_BRANCH,
  CI_JOB_ID,
  CI_PIPELINE_ID,
  CI_USER_LOGIN,
  baseDir,
 } from '../ci-consts.mjs'
import { mods } from '../modules.mjs'
import { PkgInfoForBuild } from '../ci-types.mjs'


const argv = retrieveArgsFromProcess()
// console.info(argv)

console.log({ mods })

const img = argv.src
if (! img) {
  throw new Error('Parameter of src invalid')
}
const ga = argv.ga

const pkgInfoForBuild: PkgInfoForBuild = argv['build-info']
  ? JSON.parse(argv['build-info'])
  : void 0
assert(pkgInfoForBuild, 'Parameter of build-info invalid')
assert(pkgInfoForBuild.buildTmpDir, 'Parameter of build-info.buildTmpDir invalid')

const dockerRegistry: string = pkgInfoForBuild.dockerRegistry
assert(dockerRegistry, 'Parameter of docker-reg invalid')

const baseImage = argv['base-img']
assert(baseImage, 'Parameter of base-img invalid')

const publisher = argv.publisher ?? 'n/a'

const pkgName = pkgInfoForBuild.name
assert(pkgName, 'Parameter of pkgName invalid')

const pkgImgNameNorm = pkgInfoForBuild.imgPatchName
assert(pkgImgNameNorm, 'Parameter of pkgImgNameNorm invalid')

const pkgVer = pkgInfoForBuild.version
assert(pkgVer, 'Parameter of pkgVer invalid')

const { imgLatest, imgMajor, imgMinor, imgPatch } = pkgInfoForBuild
assert(imgPatch, 'Parameter of imgPatch invalid')


let logMsg = ''
logMsg = ` \n
-------------------------------------------
     build images and sync process
-------------------------------------------
`
console.info(logMsg)

if (! CI_COMMIT_TAG && ! CI_DEFAULT_BRANCH) {
  assert(false, `Both ${CI_COMMIT_TAG} and ${CI_COMMIT_BRANCH} are empty!`)
}


// source "$cwd/.scripts/util/login-docker-repo.sh"

const cacheFrom = argv['cache-from'] ?? ''

console.info(`>>> Verifing image: "${img}" if exists`)
const ret = await $`$cwd/.scripts/util/info-pkg-image.sh ${img} $iifmtId`
  .catch(async (ret) => {

    if (ret.exitCode === 2) {
      // exitCode === 2
      console.info('-------------------------------------------')
      await $`docker image inspect -f "$iifmt" ${img}`
      console.info(' ')
      logMsg = ` \n\n
=================================== NOTE =========================================')
Image exists in remote, skip
image: ${img}
==================================================================================
  `
      process.exit()
    }
    else if (ret.exitCode === 1) {
      console.info(`Image of ${img} exists in local. pushing to remote.`)
      await $`docker push --quiet ${imgPatch}`
      process.exit()
    }
  })

if (!ret) {
  console.error(`result type not object`)
  process.exit(1)
}


const { fileNameNormVer, installName } = pkgInfoForBuild
assert(fileNameNormVer, 'fileNameNormVer undefined')

const pkgBuildTmpDir = pkgInfoForBuild.buildTmpDir
assert(pkgBuildTmpDir, 'pkgBuildTmpDir undefined')

await $`mkdir -p ${pkgBuildTmpDir}`
cd(pkgBuildTmpDir)
await $`${baseDir}/.scripts/util/download-npm-pkg.sh ${installName} ${fileNameNormVer}.tgz`
cd(`${pkgBuildTmpDir}/package`)
await $`$cwd/.scripts/util/prepare-pkg.sh`
console.info('------------------')
await $`du -sh ${pkgBuildTmpDir}/package/* `
console.info('------------------')
console.info('>>> Splitting node_modules')

await $`date`
$.verbose = false
const pms: Promise<unknown>[] = []

mods.forEach((elms, idx) => {
  elms.forEach((elm) => {
    pms.push($`"$cwd/.scripts/ci/ci-split-pkg-deps.sh" ${elm} ${idx}`)
  })
})
try {
  await Promise.all(pms)
  const { scope } = pkgInfoForBuild
  await $`"$cwd/.scripts/ci/ci-split-pkg-deps.sh" ${scope} 99`
}
catch (ex) {
  $.verbose = true
  throw ex
}
$.verbose = true
await $`date`

await $`du -sh *`
console.info('------------------')

console.info(`>>> Building image`)

const args = [
  '--build-arg', `baseImage=${baseImage}`,
  '--label', `baseImage=${baseImage}`,
  '--label', `publisher=${publisher}`,
  '--label', `pkgName=${pkgName}`,
  '--label', `pkgImgNameNorm=${pkgImgNameNorm}`,
  '--label', `pkgVer=${pkgVer}`,
  '--label', `fileNameNormVer=${fileNameNormVer}`,
  '--label', `CI_PIPELINE_ID=${CI_PIPELINE_ID}`,
  '--label', `CI_JOB_ID=${CI_JOB_ID}`,
  '--label', `CI_USER_LOGIN=${CI_USER_LOGIN}`,
]

if (cacheFrom) {
  try {
    await $`docker pull ${cacheFrom}`
    args.push('--cache-from', cacheFrom)
  }
  catch (ex) {
    console.warn(ex)
  }
}
args.push('-t', imgPatch)

await $`docker build ${args} ./ `


$.verbose = true
if (ga) {
  console.info('>>> Tagging images')
  await Promise.all([
    $`docker tag ${imgPatch} ${imgLatest}`,
    $`docker tag ${imgPatch} ${imgMajor}`,
    $`docker tag ${imgPatch} ${imgMinor}`,
  ])
    .catch((ex) => {
      console.error(ex)
      process.exit(1)
    })
}

console.info('>>> Pushing images')

await $`docker push --quiet ${imgPatch} `
if (ga) {
  await Promise.all([
    $`docker push --quiet ${imgMinor} `,
    $`docker push --quiet ${imgMajor} `,
    $`docker push --quiet ${imgLatest} `,
  ])
    .catch((ex) => {
      console.error(ex)
      process.exit(1)
    })
}


console.info('----------------------------')
await $`docker image ls ${imgPatch}`
await $`docker image inspect -f "$iifmt" ${imgPatch}`
console.info('----------------------------')

console.info('>>> Cleaning local image')
if (ga) {
  await Promise.all([
    $`docker rmi ${imgMajor} > /dev/null`,
    $`docker rmi ${imgMinor} > /dev/null`,
    $`docker rmi ${imgLatest} > /dev/null`,
    $`docker rmi ${imgPatch} `,
  ])
}


logMsg = ` \n
-------------------------------------------
     build images and sync succeeded
-------------------------------------------
`
console.info(logMsg)

await $`$cwd/.scripts/util/image-random-prune.sh`.catch(() => void 0)

