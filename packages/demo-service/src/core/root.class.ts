import { Inject, Plugin } from '@midwayjs/decorator'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ILogger } from '@midwayjs/logger'
import type { Koid } from 'egg-koid'

import MyError from '../util/my-error'


export class RootClass {

  /**
   * Context 上下文日志
   */
  @Inject() readonly logger: ILogger

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

  throwError(message: string, status?: number, errors?: unknown[]): never {
    throw new MyError(message, status, errors)
  }

}

