import { App, Inject, Plugin } from '@midwayjs/decorator'
// eslint-disable-next-line import/no-extraneous-dependencies
// import { ILogger } from '@midwayjs/logger'
import { Logger } from '@mw-components/jaeger'
import { KoidComponent } from '@mw-components/koid'
import { TaskManComponent } from '@mw-components/taskman'
import { Jwt } from '@waiting/egg-jwt'

import { Application, Context, FetchOptions } from '~/interface'
import MyError from '~/util/my-error'


export class RootClass {

  @App() protected readonly app: Application

  @Inject() readonly ctx: Context

  /**
   * jaeger Context SPAN 上下文日志
   */
  @Inject('jaeger:logger') readonly logger: Logger
  // @Inject() readonly logger: ILogger

  @Inject() readonly koid: KoidComponent

  @Inject('taskman:taskManComponent') readonly taskMan: TaskManComponent

  @Plugin() readonly jwt: Jwt

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

  /* istanbul ignore next */
  /**
   * Generate an RxRequestInit variable,
   * @default
   *   - contentType: 'application/json; charset=utf-8'
   *   - dataType: 'json'
   *   - timeout: 60000
   */
  get initFetchOptions(): FetchOptions {
    const args: FetchOptions = {
      url: '',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
    }
    return args
  }

  throwError(message: string, status?: number, errors?: unknown[]): never {
    throw new MyError(message, status, errors)
  }

}

