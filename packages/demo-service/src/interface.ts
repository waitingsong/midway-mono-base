/* eslint-disable import/no-extraneous-dependencies */
import { MidwayConfig, PowerPartial } from '@midwayjs/core'
import { PrometheusConfig } from '@midwayjs/prometheus'
import { JwtState } from '@mw-components/jwt'
import type { Knex } from '@mw-components/kmore'

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
  interface Context {
    reqId: string
    _internalError?: Error
    jwtState: JwtState<JwtUser>
    dbTransactions: Set<DbTransaction>
  }
}

export {
  IMidwayApplication,
  IMidwayContainer,
  IMiddleware,
  NextFunction,
} from '@midwayjs/core'

export type AppConfig = PowerPartial<MidwayConfig>
export {
  Application, Context,
} from '@midwayjs/koa'


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'

export type DbTransaction = Knex.Transaction

export {
  TracerTag, TracerLog, HeadersKey,
} from '@mw-components/jaeger'


export { Options as FetchOptions } from '@mw-components/fetch'
export { JwtResult } from '@mw-components/jwt'
