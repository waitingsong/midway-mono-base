import { join } from 'node:path'
import { stat } from 'node:fs/promises'

import { $ } from 'zx'

import { CI_COMMIT_TAG, baseDir } from '../ci-consts.mjs'
import type { PkgInfoLite } from '../ci-types.mjs'
import { GenPkgInfoForBuildOpts, genPkgInfoForBuild } from './project-info.js'


export interface BuildPackageOpts {
  baseImg: string
  dockerRegistry?: string
  globalIgnoreFile: string
  publisher?: string
}
export async function buildPackage(pkg: PkgInfoLite, options: BuildPackageOpts): Promise<void> {
  const {
    baseImg,
    dockerRegistry,
    globalIgnoreFile,
    publisher,
   } = options

  const pkgJsonFilePath = join(pkg.location, 'package.json')
  const pkgJsonFileExists = await stat(pkgJsonFilePath).then(() => true).catch(() => false)
  if (! pkgJsonFileExists) { return }

  const dockerfileFilePath = join(pkg.location, 'Dockerfile')
  const dockerfileFileExists = await stat(dockerfileFilePath).then(() => true).catch(() => false)
  if (! dockerfileFileExists) { return }

  const dockerIgnoreFile = join(pkg.location, '.dockerignore')
  const dockerIgnoreFileExists = await stat(dockerIgnoreFile).then(() => true).catch(() => false)
  if (! dockerIgnoreFileExists) {
    await $`cp ${globalIgnoreFile} ${dockerIgnoreFile}`
  }

  const opts: GenPkgInfoForBuildOpts = {
    pkgLocation: pkg.location,
    dockerRegistry,
  }
  const pkgInfoForBuild = await genPkgInfoForBuild(opts)

  const { imgPatch, imgLatest, buildTmpDir } = pkgInfoForBuild

  const args: string[] = [
    '--src', imgPatch,
    '--base-img', baseImg,
    '--cache-from', imgLatest,
    '--build-info', JSON.stringify(pkgInfoForBuild),
    '--publisher', publisher ?? 'n/a',
  ]

  if (CI_COMMIT_TAG) {
    args.push('--ga=true')
    await $`${baseDir}/.scripts/ci/ci-build-image.mts ${args}`
  }
  else {
    await $`${baseDir}/.scripts/ci/ci-build-image.mts ${args}`
  }

  await $`rm -rf ${ buildTmpDir}`
}
