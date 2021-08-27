/* eslint-disable import/no-extraneous-dependencies */
import {
  IMidwayWebApplication as Application,
  IMidwayWebContext as Context,
  IMidwayWebNext,
} from '@midwayjs/web'
import { JwtState } from '@mw-components/jwt'
import type { Knex } from '@mw-components/kmore'


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'
export * from './types'


export type DbTransaction = Knex.Transaction

export { TracerLog } from '@mw-components/jaeger'
export {
  NpmPkg,
  JsonObject,
  JsonResp,
  JsonType,
} from '@waiting/shared-types'


export { Options as FetchOptions } from '@mw-components/fetch'
export { JwtResult } from '@mw-components/jwt'
export { IMidwayContainer } from '@midwayjs/core'

export {
  Application,
  Context,
  IMidwayWebNext,
}

declare module '@midwayjs/core' {
  interface Context {
    reqId: string
    _internalError?: Error
    jwtState: JwtState<JwtUser>
    dbTransactions: Set<DbTransaction>
  }
}

export type MiddlewarePathPattern = (string | RegExp | PathPatternFunc)[]
export type PathPatternFunc = (ctx: Context) => boolean
export type RedirectURL = string
export type passthroughCallback = (ctx: Context) => Promise<boolean | RedirectURL>

export interface JwtUser {
  uid: string
}

