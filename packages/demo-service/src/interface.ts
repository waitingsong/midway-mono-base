import { JwtState } from '@waiting/egg-jwt'


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'
export * from './types'


export { TracerLog } from '@mw-components/jaeger'
export {
  JsonObject,
  JsonResp,
  JsonType,
} from '@waiting/shared-types'

export {
  IMidwayWebApplication as Application,
  IMidwayWebContext as Context,
} from '@midwayjs/web'

export { Options as FetchOptions } from '@mw-components/fetch'


export { NpmPkg } from '@waiting/shared-types'

declare module '@midwayjs/core' {
  interface Context {
    reqId: string
    _internalError?: Error
    jwtState?: JwtState
  }
}

