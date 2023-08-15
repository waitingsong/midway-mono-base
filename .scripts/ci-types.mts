
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

