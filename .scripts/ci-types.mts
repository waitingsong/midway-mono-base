import type { NpmPkg } from '@waiting/shared-types'

export interface PkgInfoLite {
  name: string
  version: string
  private: boolean
  location: string
}


export enum NpmLogLevel {
  error = 'error',
  warn = 'warn',
  notice = 'notice',
  http = 'http',
  info = 'info',
  verbose = 'verbose',
  silent = 'silent',
}

/**
 * @link https://docs.npmjs.com/cli/v8/commands/npm-version
 */
export enum SemVerList {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
  premajor = 'premajor',
  preminor = 'preminor',
  prepatch = 'prepatch',
  prerelease = 'prerelease',
}


export interface PkgInfoForBuild extends PkgInfoLite {
  scope: string
  majorVer: number
  minorVer: string

  /**
   * full name with version
   * @example
   *    - @foo/bar@latest
   *    - @foo/bar@1.2.3
   *    - bar@1.2.3
   */
  installName: string

  dockerRegistry: string
  /** foo/bar:latest w/o prefix \@ */
  imgLatestName: string
  /** foo/bar:1  w/o prefix \@*/
  imgMajorName: string
  /** foo/bar:1.2  w/o prefix \@ */
  imgMinorName: string
  /**
   * CI triggered:
   *   - foo/bar:1.2.3
   *
   * Manual triggered:
   *   - foo/bar:manual-<hash>-1.2.3
   */
  imgPatchName: string

  /** registry.docker.com/foo/bar:latest */
  imgLatest: string
  /** registry.docker.com/foo/bar:1 */
  imgMajor: string
  /** registry.docker.com/foo/bar:1.2 */
  imgMinor: string
  /**
   * CI triggered:
   *   - registry.docker.com/foo/bar:1.2.3
   *
   * Manual triggered:
   *   - registry.docker.com/foo/bar:manual-<hash>-1.2.3
   */
  imgPatch: string

  imgNameNorm: string
  fileNameNormVer: string
  buildTmpDir: string
}
