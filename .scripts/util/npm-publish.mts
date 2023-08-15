#!/usr/bin/env ts-node-esm
/**
 * @param {string} dir
 * @param {string} logLevel - optional
 */
import assert from 'node:assert'
import minimist from 'minimist'
import { $, cd } from 'zx'

import { NPM_LOG_LEVEL } from '../ci-consts.mjs'

const argv = minimist(process.argv.slice(2))

$.verbose = true
console.info('>>> publishing...')

const logLevel = argv.loglevel ?? NPM_LOG_LEVEL
const dir = argv.dir ?? ''
assert(dir, 'dir not set')

cd(dir)
await $`pwd && date`
const args: string[] = [
  '--loglevel', logLevel
]
await $`npm publish ${args}`

