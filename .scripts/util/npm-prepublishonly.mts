#!/usr/bin/env ts-node-esm
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'
import minimist from 'minimist'
import { $, cd } from 'zx'

import { baseDir, NPM_REGISTRY } from '../ci-consts.mjs'


$.verbose = true
await $`pwd && date`
console.info('>>> prepublishOnly...')

const argv = minimist(process.argv.slice(2))

const dir = argv.dir ?? ''
assert(dir, 'dir not set')

cd(dir)

const npmReg = argv.NPM_REGISTRY ?? NPM_REGISTRY
const args: string[] = [
  '--ignore-scripts',
  '--no-audit',
  '--omit', 'dev',
  '--omit', 'optional',
  '--package-lock-only',
  // '--legacy-peer-deps',
]
if (npmReg) {
  args.push('--registry', npmReg)
}

const pkgFile = `${baseDir}/package.json`
try {
  await $`rm -f ${pkgFile}`
  await $`npm i ${args}`
  await $`date`
  await $`npm shrinkwrap`
  await $`date`
  await $`ls -l npm-shrinkwrap.json`
}
finally {
  await $`git restore ${pkgFile}`
}

