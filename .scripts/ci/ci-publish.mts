#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 * @param registry
 */
import assert from 'node:assert'
import { retrieveArgsFromProcess } from '@waiting/shared-core'

import { getNpmPkgViewFromRegistry } from '@waiting/shared-core'
import { $, sleep, fs } from 'zx'

import {
  baseDir,
  CI,
  NPM_LOG_LEVEL,
  NPM_VERSION_REGISTRY,
  USER_HOME,
 } from '../ci-consts.mjs'
import { NpmLogLevel, PkgInfoLite } from '../ci-types.mjs'
import { getProjectPkgList } from '../util/project-info.js'

$.verbose = true
await $`pwd && date`

const argv = retrieveArgsFromProcess()
console.info(argv)

let msg = `

-------------------------------------------
            publish process
-------------------------------------------
`
console.info(msg)


const lernaConfigFile = `${baseDir}/lerna.json`
const lernaConfig: Record<string, any> = await fs.readJson(lernaConfigFile)
const lernaNpmReg: string | undefined = lernaConfig.registry
console.info({ lernaNpmReg })

let pubNpmReg: string | undefined = argv.registry ?? NPM_VERSION_REGISTRY
if (! pubNpmReg) {
  pubNpmReg = lernaNpmReg
}

const npmrcFile = `${USER_HOME}/.npmrc`
const npmrcFileBack = `${USER_HOME}/.npmrc.back`

await $`cp -f ${npmrcFile} ${npmrcFileBack}`

console.info('>>> set npmrc...')
const pubLogLevel = argv.loglevel ?? NPM_LOG_LEVEL
const pubDebug = pubLogLevel === NpmLogLevel.verbose ? true : false
await $`.scripts/util/npm-set-publish-token.mts --registry ${pubNpmReg} --check --debug ${pubDebug}`

CI && await $`nx reset`
await $`npm run clean`
await $`date`
await $`npm i`
await $`npm run build`

const pkgs = await getProjectPkgList(baseDir)
assert(pkgs.length > 0, 'no packages found')

for (const pkg of pkgs) {
  if (pkg.private === true) {
    console.info(`skip private package: ${pkg.name}`)
    continue
  }
  const pkgExists = await getNpmPkgViewFromRegistry(pkg.name, pkg.version, pubNpmReg)
  if (pkgExists) {
    console.info(`skip existing package: ${pkg.name}@${pkg.version}`)
    continue
  }

  console.info(`\n\n>> publish package: ${pkg.name}`)
  await $`.scripts/util/npm-prepublishonly.mts --dir ${pkg.location}`
  await $`.scripts/util/npm-publish.mts --dir ${pkg.location} --loglevel ${pubLogLevel} `
  await sleep('6s')
}


// restore npmrc
await $`cp -f ${npmrcFileBack} ${npmrcFile}`
await $`lerna run clean:cache`

