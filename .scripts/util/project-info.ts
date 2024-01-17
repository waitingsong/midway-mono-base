import assert from 'node:assert'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { $, cd } from 'zx'
import semver from 'semver'
import type { NpmPkg } from '@waiting/shared-types'

import { BUILD_TMP_DIR, pkgInfo as projectPkgInfo } from '../ci-consts.mjs'
import type { PkgInfoForBuild, PkgInfoLite } from '../ci-types.mjs'


export async function getProjectPkgList(baseDir?: string, all = false): Promise<PkgInfoLite[]> {
  if (baseDir) {
    await cd(baseDir)
  }
  const resp = all
    ?  await $`lerna ls --toposort --json --loglevel error --all`
    :  await $`lerna ls --toposort --json --loglevel error `
  const projectPkgList = JSON.parse(resp.stdout) as PkgInfoLite[]
  return projectPkgList ?? []
}

export interface GenPkgInfoForBuildOpts {
  /**
   * package full path location
   * @example /work/project-foo/packages/svc
   */
  pkgLocation: string
  /**
   * docker registry
   * @description priority: argv > pkgJson > projectPkgInfo
   * @example registry.cn-hangzhou.aliyuncs.com
   */
  dockerRegistry?: string
}
export async function genPkgInfoForBuild(options: GenPkgInfoForBuildOpts): Promise<PkgInfoForBuild> {
  const { pkgLocation, dockerRegistry } = options

  const pkgJsonFile = join(pkgLocation, 'package.json')
  const pkgJsonFileUrl = pathToFileURL(pkgJsonFile).href
  // verbose && console.info({ baseDir, pkg, pkgJsonFile, pkgJsonFileUrl })
  await stat(pkgJsonFile)

  const pkgJson: NpmPkg = await import(pkgJsonFileUrl, { assert: { type: 'json' } })
  assert(pkgJson, `read pkgJson failed, file: "${pkgJsonFile}"`)
  assert(pkgJson.name, `pkgJson.name empty, file: "${pkgJsonFile}"`)
  assert(pkgJson.version, `pkgJson.version empty, file: "${pkgJsonFile}"`)

  const dreg: string | undefined = dockerRegistry
    ? dockerRegistry
    : (pkgJson['dockerRegistry'] ? pkgJson['dockerRegistry'] : projectPkgInfo['dockerRegistry'])

  const { name, version } = pkgJson

  let pkgScope = '' // @foo/bar => foo
  if (name.startsWith('@')) {
    pkgScope = name.split('/')[0]
  }

  const majorValue = semver.major(version)
  const minorValue = semver.minor(version)
  // const patchValue = semver.patch(version)

  // "@foo/bar" => "foo-bar"
  const imgNameNorm = name.replace(/[@]/ug, '').replace(/\//ug, '-')
  assert(imgNameNorm, `Value of name from package.json invalid!`)

  const latestVer = 'latest'
  const majorVer = majorValue // 1
  const minorVer = `${majorVer}.${minorValue}` // '1.2'
  // const patchVer = `${minorVer}.${patchValue}` // '1.2.3'

  // # @scope/pkg => scope-pkg:version
  const imgLatestName = `${imgNameNorm}:${latestVer}`
  const imgMajorName = `${imgNameNorm}:${majorVer}`
  const imgMinorName = `${imgNameNorm}:${minorVer}`
  const imgPatchName = `${imgNameNorm}:${version}`

  let imgLatest = imgLatestName
  let imgMajor = imgMajorName
  let imgMinor = imgMinorName
  let imgPatch = imgPatchName
  if (dreg) {
    imgLatest = `${dreg}/${imgLatest}`
    imgMajor = `${dreg}/${imgMajor}`
    imgMinor = `${dreg}/${imgMinor}`
    imgPatch = `${dreg}/${imgPatch}`
  }

  // # scope-pkg-1.2.3
  const fileNameNormVer = `${imgNameNorm}-${version}`

  const buildTmpDir = join(BUILD_TMP_DIR, fileNameNormVer)

  const installName = `${name}@${version}`

  const pkgInfoForBuild: PkgInfoForBuild = {
    name,
    version,
    private: pkgJson.private ?? false,
    location: pkgLocation,

    scope: pkgScope,
    majorVer,
    minorVer,
    installName,

    dockerRegistry: dreg ?? '',
    imgLatestName,
    imgMajorName,
    imgMinorName,
    imgPatchName,

    imgLatest,
    imgMajor,
    imgMinor,
    imgPatch,

    imgNameNorm,
    fileNameNormVer,
    buildTmpDir,
  }

  return pkgInfoForBuild
}

