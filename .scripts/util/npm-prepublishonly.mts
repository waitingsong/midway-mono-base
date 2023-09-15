#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $, cd } from 'zx'

import { baseDir, NPM_REGISTRY } from '../ci-consts.mjs'


$.verbose = true
await $`pwd && date`
console.info('>>> prepublishOnly...')

const argv = retrieveArgsFromProcess()

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
  await $`date && ls -Al`
  await $`npm shrinkwrap`
  await $`date && ls -Al`
  await $`ls -l npm-shrinkwrap.json`
}
finally {
  await $`git restore ${pkgFile}`
}

