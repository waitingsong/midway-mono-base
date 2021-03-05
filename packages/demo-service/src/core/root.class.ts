import { Inject, Plugin } from '@midwayjs/decorator'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ILogger } from '@midwayjs/logger'
import { Fetch, RxRequestInit } from '@waiting/egg-fetch'
import { Jwt } from '@waiting/egg-jwt'
import type { Koid } from 'egg-koid'

import MyError from '../util/my-error'


export class RootClass {

  /**
   * Context 上下文日志
   */
  @Inject() readonly logger: ILogger

  @Plugin() readonly fetch: Fetch

  @Plugin() readonly jwt: Jwt

  @Plugin() readonly koid: Koid

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
    return this.koid.nextBigint
  }

  /* istanbul ignore next */
  /**
   * Generate an RxRequestInit variable,
   * with dataType: 'json'
   */
  get initFetchArgs(): RxRequestInit {
    const args: RxRequestInit = {
      dataType: 'json',
    }
    return args
  }

  throwError(message: string, status?: number, errors?: unknown[]): never {
    throw new MyError(message, status, errors)
  }

}

