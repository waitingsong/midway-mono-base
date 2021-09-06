/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http'

import { Inject } from '@midwayjs/decorator'
import {
  FetchComponent,
  FetchResponse,
  Node_Headers,
} from '@mw-components/fetch'
import { OverwriteAnyToUnknown } from '@waiting/shared-types'

import { RootClass } from './root.class'

import { JsonResp, FetchOptions } from '~/interface'


export class BaseService extends RootClass {

  @Inject('fetch:fetchComponent') protected readonly fetch: FetchComponent

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为 `JsonResp` 结构
   */
  getJson<T extends FetchResponse = any>(
    url: string,
    data?: FetchOptions['data'],
  ): Promise<JsonResp<OverwriteAnyToUnknown<T>>> {

    const opts = this.initFetchOptions
    if (typeof data !== 'undefined') {
      opts.data = data
    }
    return this.fetch.get(url, opts) as Promise<JsonResp<OverwriteAnyToUnknown<T>>>
  }

  /**
   * 请求和返回类型都是 JSON 格式，
   * 返回类型为 `JsonResp` 结构
   */
  postJson<T extends FetchResponse = any>(
    url: string,
    data?: FetchOptions['data'],
  ): Promise<JsonResp<OverwriteAnyToUnknown<T>>> {

    const opts = this.initFetchOptions
    if (typeof data !== 'undefined') {
      opts.data = data
    }
    return this.fetch.post(url, opts) as Promise<JsonResp<OverwriteAnyToUnknown<T>>>
  }

  /**
   * 返回类型为 `text` 或者 `html`
   */
  getText<T extends string = string>(
    url: string,
    data?: FetchOptions['data'],
  ): Promise<T> {

    const opts: FetchOptions = {
      ...this.initFetchOptions,
      dataType: 'text',
    }
    if (typeof data !== 'undefined') {
      opts.data = data
    }
    const ret = this.fetch.get<T>(url, opts)
    return ret as Promise<T>
  }

  /**
   * 根据输入 http headers 生成 Headers,
   * @returns Headers 默认不包括 'host' 字段
   */
  genFetchHeaders(
    headers?: HeadersInit | IncomingHttpHeaders,
    excludes: string[] = ['host'],
  ): Headers {
    const ret = new Node_Headers(headers as HeadersInit)
    if (Array.isArray(excludes)) {
      excludes.forEach(key => ret.delete(key))
    }
    return ret
  }

}

