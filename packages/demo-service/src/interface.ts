
export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'
export { JsonResp } from './core/types'
export { ErrorCode } from './error-code'


declare module 'egg' {
  interface Context {
    reqId: string
  }
}

