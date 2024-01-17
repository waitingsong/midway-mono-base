#!/usr/bin/env tsx
/**
 * Collect, merge and print coverage summary so that GitLab CI can parse the coverage number
 * from a string like "Statements   : 100% ( 135/135 )"
 */
import assert from 'node:assert'
import { join } from 'node:path'
import { stat, cp, rm, mkdir } from 'node:fs/promises'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $ } from 'zx'

import { baseDir, pkgInfo as projectPkgInfo } from './ci-consts.mjs'
import { getProjectPkgList } from './util/project-info.js'


await $`pwd && date`
const argv = retrieveArgsFromProcess()
const verbose = !! argv.verbose
verbose && console.info(argv)


$.verbose = verbose
const tmpCovDir = join(baseDir, 'coverage', 'tmp')
await rm(tmpCovDir, { recursive: true, force: true })
await mkdir(tmpCovDir, { recursive: true })

// 框架测试时包括所有子包
const pkgs = typeof projectPkgInfo.name === 'string' && projectPkgInfo.name.includes('midway-mono-base')
  ? await getProjectPkgList(baseDir, true)
  : await getProjectPkgList(baseDir)
assert(pkgs.length > 0, 'no packages found')

await $`cp -r ${baseDir}/packages/*/coverage/tmp/. ${tmpCovDir}`
await $`du -sh ${baseDir}/coverage`
$.verbose = true
await $`c8 report --reporter=text-summary --reporter=html --reporter=json --reporter=cobertura`
await rm(tmpCovDir, { recursive: true, force: true })

