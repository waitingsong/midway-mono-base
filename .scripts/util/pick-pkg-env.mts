#!/usr/bin/env tsx
/**
 * Should called by tar.sh, build-images.sh, cd-distribute-images.sh
 * Run under the top folder
 * @return PkgInfoForBuild
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $ } from 'zx'

import { GenPkgInfoForBuildOpts, genPkgInfoForBuild } from './project-info.js'


await $`pwd && date`
const argv = retrieveArgsFromProcess()

const verbose = !! argv.verbose
verbose && console.info(argv)

$.verbose = true

const pkg: string | undefined = argv.p
assert(typeof pkg === 'string', 'param -p <pkgDir> required, like: -p ./packages/svc/ ')

const dockerRegistry: string = argv['docker-reg']

const opts: GenPkgInfoForBuildOpts = {
  pkgLocation: pkg,
  dockerRegistry,
}

const pkgInfoForBuild = await genPkgInfoForBuild(opts)
verbose && console.info({ pkgInfoForBuild })

