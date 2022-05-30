/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http'

import { App, Config, Inject } from '@midwayjs/decorator'
import {
  Node_Headers,
  FetchComponent,
  FetchResponse,
} from '@mw-components/fetch'
import { Logger } from '@mw-components/jaeger'
import { JwtComponent } from '@mw-components/jwt'
import { KoidComponent } from '@mw-components/koid'
import { ClientService } from '@mw-components/taskman'
import { OverwriteAnyToUnknown } from '@waiting/shared-types'

import {
  Application,
  Context,
  DbTransaction,
  FetchOptions,
  JsonResp,
  NpmPkg,
  TracerTag,
} from '../interface'
import { JwtUser } from '../types'
import MyError from '../util/my-error'


export class RootClass {

  @App() protected readonly app: Application

  @Inject() readonly ctx: Context

  @Inject() private readonly fetchService: FetchComponent

  /**
   * jaeger Context SPAN 上下文日志
   */
  @Inject('jaeger:logger') readonly logger: Logger

  @Inject() readonly koid: KoidComponent

  @Inject() readonly jwt: JwtComponent

  @Inject() readonly taskMan: ClientService

  @Config() readonly pkg: NpmPkg

  /**
   * SnowFlake id Generatoror
   * @usage ```
   *  const id = this.idGenerator
   *  const strId = id.toString()
   *  const hexId = id.toString(16)
   *  const binId = id.toString(2)
   * ```
   */
  get idGenerator(): bigint {
    return this.koid.idGenerator
  }

  /* c8 ignore next */
  /**
   * Generate an RxRequestInit variable,
   * @default
   *   - contentType: 'application/json; charset=utf-8'
   *   - dataType: 'json'
   *   - timeout: 60000
   *   - headers:
   *     - svc.name
   *     - svc.ver
   */
  get initFetchOptions(): FetchOptions {
    const { pkg } = this
    const headers: HeadersInit = {
      [TracerTag.svcName]: pkg.name,
      [TracerTag.svcVer]: pkg.version ?? '',
    }
    const args: FetchOptions = {
      url: '',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      headers,
    }
    return args
  }

  /* c8 ignore start */

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为 `JsonResp` 结构
   */
  fetch<T extends FetchResponse = any>(
    options: FetchOptions,
  ): Promise<JsonResp<OverwriteAnyToUnknown<T>>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options.headers),
    }
    return this.fetchService.fetch(opts) as Promise<JsonResp<OverwriteAnyToUnknown<T>>>
  }

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为 `JsonResp` 结构
   */
  getJson<T extends FetchResponse = any>(
    url: string,
    options?: FetchOptions,
  ): Promise<JsonResp<OverwriteAnyToUnknown<T>>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options?.headers),
    }
    return this.fetchService.get(url, opts) as Promise<JsonResp<OverwriteAnyToUnknown<T>>>
  }

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为 `JsonResp` 结构
   */
  postJson<T extends FetchResponse = any>(
    url: string,
    options?: FetchOptions,
  ): Promise<JsonResp<OverwriteAnyToUnknown<T>>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options?.headers),
    }
    return this.fetchService.post(url, opts) as Promise<JsonResp<OverwriteAnyToUnknown<T>>>
  }


  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为自定义结构
   */
  fetchCustom<T>(
    options: FetchOptions,
  ): Promise<OverwriteAnyToUnknown<T>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options.headers),
    }
    return this.fetchService.fetch(opts) as Promise<OverwriteAnyToUnknown<T>>
  }

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为自定义结构
   */
  getCustomJson<T>(
    url: string,
    options?: FetchOptions,
  ): Promise<OverwriteAnyToUnknown<T>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options?.headers),
    }
    return this.fetchService.get(url, opts) as Promise<OverwriteAnyToUnknown<T>>
  }

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为自定义结构
   */
  postCustomJson<T>(
    url: string,
    options?: FetchOptions,
  ): Promise<OverwriteAnyToUnknown<T>> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options?.headers),
    }
    return this.fetchService.post(url, opts) as Promise<OverwriteAnyToUnknown<T>>
  }

  /* c8 ignore stop */

  /**
   * 返回类型为字符串
   */
  async getText<T extends string = string>(
    url: string,
    options?: FetchOptions,
  ): Promise<T> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      ...options,
      headers: this.genFetchHeaders(options?.headers),
      dataType: 'text',
    }
    const ret = await this.fetchService.get<T>(url, opts)
    return ret as T
  }

  /**
   * 根据输入 http headers 生成 Headers,
   * @returns Headers 默认不包括 'host' 字段
   */
  genFetchHeaders(
    headers?: HeadersInit | IncomingHttpHeaders | undefined,
    excludes: string[] = ['host'],
  ): Headers {

    const ret = new Node_Headers(this.initFetchOptions.headers)
    const inputHeaders = new Node_Headers(headers as HeadersInit)

    inputHeaders.forEach((val, key) => {
      if (Array.isArray(excludes) && excludes.includes(key)) {
        return
      }
      ret.set(key, val)
    })

    return ret
  }

  get jwtPayload(): JwtUser {
    if (! this.ctx.jwtState.user) {
      this.throwError('获取 jwt payload 信息为空')
    }
    return this.ctx.jwtState.user
  }

  throwError(message: string, status?: number, errors?: unknown[]): never {
    throw new MyError(message, status, errors)
  }

  protected async commitTransaction(trx: DbTransaction): Promise<void> {
    try {
      if (trx.isTransaction && ! trx.isCompleted()) {
        await trx.commit()
      }
    }
    finally {
      this._removeTransaction(trx)
    }
  }

  protected async rollbackTransaction(trx: DbTransaction): Promise<void> {
    try {
      if (trx.isTransaction && ! trx.isCompleted()) {
        await trx.rollback()
      }
    }
    finally {
      this._removeTransaction(trx)
    }
  }

  protected _removeTransaction(trx: DbTransaction): void {
    this.ctx.dbTransactions.delete(trx)
  }

}

