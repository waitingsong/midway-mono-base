import { App, Inject } from '@midwayjs/decorator'
import { Logger } from '@mw-components/jaeger'
import { JwtComponent } from '@mw-components/jwt'
import { KoidComponent } from '@mw-components/koid'
import { TaskManComponent } from '@mw-components/taskman'

import {
  Application,
  Context,
  DbTransaction,
  FetchOptions,
  JwtUser,
  NpmPkg,
  TracerTag,
} from '~/interface'
import MyError from '~/util/my-error'


export class RootClass {

  @App() protected readonly app: Application

  @Inject() readonly ctx: Context

  /**
   * jaeger Context SPAN 上下文日志
   */
  @Inject('jaeger:logger') readonly logger: Logger

  @Inject() readonly koid: KoidComponent

  @Inject('jwt:jwtComponent') readonly jwt: JwtComponent

  @Inject('taskman:taskManComponent') readonly taskMan: TaskManComponent

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
   *   - headers:
   *     - svc.name
   *     - svc.ver
   */
  get initFetchOptions(): FetchOptions {
    const pkg = this.app.getConfig('pkgJson') as NpmPkg
    const headers = {
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

