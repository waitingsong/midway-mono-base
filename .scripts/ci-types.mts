
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

