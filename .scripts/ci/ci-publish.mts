#!/usr/bin/env ts-node-esm
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 * @param registry
 */
import assert from 'node:assert'
import minimist from 'minimist'
import { $, sleep, fs } from 'zx'

import {
  baseDir,
  CI,
  NPM_LOG_LEVEL,
  NPM_VERSION_REGISTRY,
  USER_HOME,
 } from '../ci-consts.mjs'
import { NpmLogLevel, PkgInfoLite } from '../ci-types.mjs'

$.verbose = true
await $`pwd && date`

const argv = minimist(process.argv.slice(2))
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
await $`npm run clean:dist`
await $`date`
await $`npm i`
await $`npm run build`

const resp = await $`lerna ls --toposort --json --loglevel error `
const pkgs = JSON.parse(resp.stdout) as PkgInfoLite[]
assert(pkgs.length > 0, 'no packages found')

for (const pkg of pkgs) {
  if (pkg.private === true) {
    console.info(`skip private package: ${pkg.name}`)
    continue
  }
  console.info(`\n\n>> publish package: ${pkg.name}`)
  await $`.scripts/util/npm-prepublishonly.mts --dir ${pkg.location}`
  await $`.scripts/util/npm-publish.mts --dir ${pkg.location} --loglevel ${pubLogLevel} `
  await sleep('6s')
}


// restore npmrc
await $`cp -f ${npmrcFileBack} ${npmrcFile}`

