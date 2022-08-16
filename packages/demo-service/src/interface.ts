/* eslint-disable import/no-extraneous-dependencies */
import { MidwayConfig } from '@midwayjs/core'
import { PrometheusConfig } from '@midwayjs/prometheus'
import { JwtState } from '@mw-components/jwt'

import { JwtUser } from './types'


export {
  JsonObject,
  JsonResp,
  JsonType,
  NpmPkg,
} from '@waiting/shared-types'

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    prometheus?: PrometheusConfig
  }
}
declare module '@midwayjs/koa/dist/interface' {
  interface Context {
    reqId: string
    _internalError?: Error
    jwtState: JwtState<JwtUser>
  }
}

export {
  IMidwayApplication,
  IMidwayContainer,
  IMiddleware,
  NextFunction,
} from '@midwayjs/core'

export type AppConfig = Partial<MidwayConfig>
export {
  Application, Context,
} from '@midwayjs/koa'


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'

export {
  TracerTag, TracerLog, HeadersKey,
} from '@mw-components/jaeger'


export { Options as FetchOptions } from '@mw-components/fetch'
export { JwtResult } from '@mw-components/jwt'
export { KmoreTransaction as DbTransaction } from 'kmore'

