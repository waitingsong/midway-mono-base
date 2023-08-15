#!/usr/bin/env zx

console.info(argv)
const baseDir = process.env.cwd
const CI_PROJECT_URL = process.env.CI_PROJECT_URL
const CI_DEFAULT_BRANCH = process.env.CI_DEFAULT_BRANCH
const CI_COMMIT_BRANCH = process.env.CI_COMMIT_BRANCH
const CI_COMMIT_TAG = process.env.CI_COMMIT_TAG


const baseImage = process.env.NODE_BASE_IMAGE
const publisher = process.env.authorOfTagOrCommit ?? 'n/a'
const pkgName = process.env.pkgName
const pkgImgNameNorm = process.env.pkgImgNameNorm
const pkgVer = process.env.pkgVer
const fileNameNormVer = process.env.fileNameNormVer
const imgPatch = process.env.imgPatch
const CI_PIPELINE_ID = process.env.CI_PIPELINE_ID
const CI_JOB_ID = process.env.$CI_JOB_ID ?? 'n/a'
const CI_USER_LOGIN = process.env.GITLAB_USER_LOGIN


let logMsg = ''
logMsg = ` \n
-------------------------------------------
     build images and sync process
-------------------------------------------
`
console.info(logMsg)

if (! CI_COMMIT_TAG && ! CI_DEFAULT_BRANCH) {
  console.error('Both $CI_COMMIT_TAG and $CI_COMMIT_BRANCH are empty!')
  process.exit(1)
}

import { mods } from '../modules.mjs'
console.log({ mods })

// source "$cwd/.scripts/util/login-docker-repo.sh"

const img = argv.src
if (! img) {
  throw new Error('Parameter of src invalid')
}
const ga = argv.ga

const cacheFrom = argv['cache-from'] ?? ''

console.info(`>>> Verifing image: "${img}" if exists`)
const ret = await nothrow($`$cwd/.scripts/util/info-pkg-image.sh ${img} $iifmtId`)
if (! ret) {
  console.error(`result type not object`)
  process.exit(1)
}
if (ret.exitCode === 2) {
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
  console.info(`Image of $pkg exists in local. pushing to remote.`)
  await $`docker push --quiet $imgPatch`
  process.exit()
}

const pkgBuildTmpDir = process.env.pkgBuildTmpDir
if (! pkgBuildTmpDir)  {
  throw new Error('pkgBuildTmpDir undefined')
}
cd(pkgBuildTmpDir)

await $`"$cwd/.scripts/util/download-npm-pkg.sh" "$pkgName@$pkgVer" "$fileNameNormVer.tgz"`
cd(`${pkgBuildTmpDir}/package`)
await $`ls -al`
// await nothrow($`$cwd/.scripts/util/save-cache.mjs \
//   --action=restore \
//   --pkg=$pkgImgNameNorm \
//   --file=package-lock.json \
//   --dirName=$BUILD_LOCKS_CACHE_DIR `)

await $`$cwd/.scripts/util/prepare-pkg.sh`
console.info('------------------')
await $`du -sh node_modules`
console.info('------------------')
console.info('>>> Splitting node_modules')

await $`date`
$.verbose = false
const pms = []
mods.forEach((elms, idx) => {
  elms.forEach((elm) => {
    pms.push($`"$cwd/.scripts/ci/ci-split-pkg-deps.sh" ${elm} ${idx}`)
  })
});
try {
  await Promise.all(pms)
  await $`"$cwd/.scripts/ci/ci-split-pkg-deps.sh" $pkgScope 99`
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
    $`docker tag "$imgPatch" "$imgLatest"`,
    $`docker tag "$imgPatch" "$imgMajor"`,
    $`docker tag "$imgPatch" "$imgMinor"`,
  ])
  .catch((ex) => {
    console.error(ex)
    process.exit(1)
  })
}

console.info('>>> Pushing images')

await $`docker push --quiet $imgPatch`
if (ga) {
  await Promise.all([
    $`docker push --quiet $imgMinor`,
    $`docker push --quiet $imgMajor`,
    $`docker push --quiet $imgLatest`,
  ])
  .catch((ex) => {
    console.error(ex)
    process.exit(1)
  })
}


console.info('----------------------------')
await $`docker image ls "$imgPatch"`
await $`docker image inspect -f "$iifmt" "$imgPatch"`
console.info('----------------------------')

console.info('>>> Cleaning local image')
if (ga) {
  await Promise.all([
    $`docker rmi $imgMajor > /dev/null`,
    $`docker rmi $imgMinor > /dev/null`,
    $`docker rmi $imgLatest > /dev/null`,
    $`docker rmi $imgPatch`,
  ])
}


logMsg = ` \n
-------------------------------------------
     build images and sync succeeded
-------------------------------------------
`
console.info(logMsg)

await nothrow($`$cwd/.scripts/util/image-random-prune.sh`)

cd(`${pkgBuildTmpDir}/package`)
await $`ls -Al`
// await nothrow($`$cwd/.scripts/util/save-cache.mjs \
//   --action=save \
//   --pkg=$pkgImgNameNorm \
//   --file=package-lock.json \
//   --dirName=$BUILD_LOCKS_CACHE_DIR `)

