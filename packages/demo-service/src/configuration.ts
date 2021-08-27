/* eslint-disable import/no-extraneous-dependencies */
import 'tsconfig-paths/register'
import { join } from 'path'

import { ILifeCycle } from '@midwayjs/core'
import {
  App,
  Config,
  Configuration,
  Inject,
  Logger,
} from '@midwayjs/decorator'
import { IMidwayLogger } from '@midwayjs/logger'
import * as prometheus from '@midwayjs/prometheus'
import * as fetch from '@mw-components/fetch'
import * as jaeger from '@mw-components/jaeger'
import * as jwt from '@mw-components/jwt'
import * as db from '@mw-components/kmore'
// eslint-disable-next-line no-duplicate-imports
import { DbConfigs, DbManager } from '@mw-components/kmore'
import * as koid from '@mw-components/koid'
// import * as tm from '@mw-components/taskman'

import { DbReplicaKeys } from '~/config/config.types'
import { Application, NpmPkg } from '~/interface'
import { customLogger } from '~/util/custom-logger'


process.env.UV_THREADPOOL_SIZE = '96'

@Configuration({
  imports: [
    jaeger,
    prometheus,
    jwt,
    koid,
    fetch,
    db,
    // tm,
  ],
  importConfigs: [join(__dirname, 'config')],
})
export class ContainerConfiguration implements ILifeCycle {

  @App() readonly app: Application

  @Logger() readonly logger: IMidwayLogger

  @Inject('kmore:dbManager') readonly dbManager: DbManager<DbReplicaKeys> | undefined

  @Config() readonly dbConfigs: DbConfigs<DbReplicaKeys> | undefined

  // 启动前处理
  async onReady(): Promise<void> {
    this.app.config.pkgJson = this.app.config.pkg as NpmPkg

    // 定制化日志
    customLogger(this.logger, this.app)

    // const coreMiddlewareArr = this.app.getConfig('coreMiddleware') as string[]
    const coreMiddlewareArr = this.app.config.coreMiddleware as string[]

    // 全局错误处理中间件（确保在最前）
    coreMiddlewareArr.splice(0, 0, 'errorHandlerMiddleware')

    // 全局x-request-id处理中间件
    coreMiddlewareArr.splice(1, 0, 'requestIdMiddleware')

    // 全局db处理中间件，请求结束时回滚所有本次请求未提交事务
    coreMiddlewareArr.splice(1, 0, 'dbTrxMiddleware')

    // 初始化数据库连接
    await this.initDbs()

    const { pkgJson } = this.app.config
    const info = {
      pkgName: pkgJson.name,
      pkgVersion: pkgJson.version,
    }
    // eslint-disable-next-line no-console
    console.log('✅ Your APP launched', info)
  }

  // async onStop(): Promise<void> {
  // }

  async initDbs(): Promise<void> {
    const { dbManager } = this

    if (dbManager && this.dbConfigs && Object.keys(this.dbConfigs).length) {
      const pms = Object.entries(this.dbConfigs)
        .map(([dbId, dbConfig]) => dbManager.connect<unknown>(dbId, dbConfig))
      await Promise.all(pms)
    }
  }
}

