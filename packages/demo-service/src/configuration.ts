/* eslint-disable import/max-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
import 'tsconfig-paths/register'
import assert from 'node:assert/strict'
import { join } from 'node:path'

import { ILifeCycle, MidwayInformationService } from '@midwayjs/core'
import {
  App,
  Config,
  Configuration,
  Inject,
  Logger,
} from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import { IMidwayLogger } from '@midwayjs/logger'
import * as prometheus from '@midwayjs/prometheus'
import * as validate from '@midwayjs/validate'
import * as aliOss from '@mw-components/ali-oss'
import * as fetch from '@mw-components/fetch'
import * as jaeger from '@mw-components/jaeger'
import * as jwt from '@mw-components/jwt'
import * as db from '@mw-components/kmore'
// eslint-disable-next-line no-duplicate-imports
import { DataSource, DbSourceManager } from '@mw-components/kmore'
import * as koid from '@mw-components/koid'
import * as tm from '@mw-components/taskman'

import { DbReplica, DbReplicaKeys } from './config/config.types'
import { DbModel } from './config/db.model'
import { DbTrxMiddleware } from './middleware/db-trx.middleware'
import { ErrorHandlerMiddleware } from './middleware/error-handler.middleware'
import { RequestIdMiddleware } from './middleware/request-id.middleware'
import { ResponseHeadersMiddleware } from './middleware/response-headers.middleware'
import { ResponseMimeMiddleware } from './middleware/response-mime.middleware'
// import { customLogger } from './util/custom-logger'

import type { Application, Context, NpmPkg } from '~/interface'


process.env['UV_THREADPOOL_SIZE'] = '96'

@Configuration({
  imports: [
    koa,
    validate,
    jaeger,
    prometheus,
    jwt,
    koid,
    fetch,
    db,
    tm,
    aliOss,
  ],
  importConfigs: [join(__dirname, 'config')],
})
export class ContainerConfiguration implements ILifeCycle {

  @App() readonly app: Application

  @Logger() readonly logger: IMidwayLogger

  @Inject() readonly informationService: MidwayInformationService

  @Inject() readonly dbManager: DbSourceManager<DbReplica, DbModel, Context>

  @Config() readonly dbConfigs: DataSource<DbReplicaKeys> | undefined


  // 启动前处理
  async onReady(): Promise<void> {

    // 定制化日志
    // customLogger(this.logger, this.app)

    // 全局x-request-id处理中间件
    // @ts-expect-error
    this.app.getMiddleware().insertFirst(RequestIdMiddleware)

    // 全局错误处理中间件（确保在最前）
    // @ts-expect-error
    this.app.getMiddleware().insertFirst(ErrorHandlerMiddleware)

    const mws = [
      ResponseMimeMiddleware,
      ResponseHeadersMiddleware,
      DbTrxMiddleware, // 全局db处理中间件，请求结束时回滚所有本次请求未提交事务
    ]
    this.app.useMiddleware(mws)

    const mwNames = this.app.getMiddleware().getNames()
    console.info({ mwNames })

    // 初始化数据库连接
    await this.initDbs()

    const pkg = this.informationService.getPkg() as NpmPkg
    assert(pkg, 'retrieve package.json failed')
    this.app.addConfigObject({ pkg })
    const info = {
      pkgName: pkg.name,
      pkgVersion: pkg.version,
    }

    // eslint-disable-next-line no-console
    console.log('✅ Your APP launched', info)
  }

  async onStop(): Promise<void> {
    return
  }

  async initDbs(): Promise<void> {
    return
    // const { dbManager } = this

    // if (dbManager && this.dbConfigs && Object.keys(this.dbConfigs).length) {
    //   const pms = Object.entries(this.dbConfigs)
    //     .map(([dbId, dbConfig]) => dbManager.connect<unknown>(dbId, dbConfig))
    //   await Promise.all(pms)
    // }
  }
}

