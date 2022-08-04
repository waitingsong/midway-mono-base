// config for `npm run cov|ci`
import { initPathArray } from '@mw-components/jwt'
import {
  DataSourceConfig,
  DbConfig,
} from '@mw-components/kmore'
import { ClientURL, ServerURL } from '@mw-components/taskman'

import { DbReplica } from './config.types'
import { DbModel, dbDict } from './db.model'

import { AppConfig, Context } from '~/interface'


export const security = {
  csrf: false,
}


// 复用 local 的配置
export {
  svcHosts,
  OssClientKey,
  aliOssConfig,
} from './config.local'


// 建议跑测试的时候关闭日志(true)，这样手动故意触发的错误，都不会显示处理。如果想看则打开(false)
export const logger = {
  disableConsoleAfterReady: true,
}


export const jwtConfig: AppConfig['jwtConfig'] = {
  secret: '123456abc', // 默认密钥，生产环境一定要更改!
}
const jwtIgnoreArr = [
  ...initPathArray,
  '/hello',
  '/ip',
  '/taskman/hello',
  '/test/err',
  '/test/array',
  '/test/blank',
  '/test/empty',
  '/test/no_output',
  '/test/sign',
  /debug\/dump\/.*/u,
  /unittest/u,
  RegExp(`${ClientURL.base}/.*`, 'u'),
  RegExp(`${ServerURL.base}/.*`, 'u'),
]
export const jwtMiddlewareConfig: AppConfig['jwtMiddlewareConfig'] = {
  enableMiddleware: true,
  ignore: jwtIgnoreArr,
}


const master: DbConfig<DbModel, Context> = {
  config: {
    client: 'pg',
    connection: {
      host: process.env['POSTGRES_HOST'] ? process.env['POSTGRES_HOST'] : 'localhost',
      port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
      database: process.env['POSTGRES_DB'] ? process.env['POSTGRES_DB'] : 'db_ci_mw',
      user: process.env['POSTGRES_USER'] ? process.env['POSTGRES_USER'] : 'postgres',
      password: process.env['POSTGRES_PASSWORD'] ? process.env['POSTGRES_PASSWORD'] : 'postgres',
    },
    pool: {
      min: 2,
      max: 30,
      // propagateCreateError: false,
    },
    acquireConnectionTimeout: 50000,
  },
  dict: dbDict,
  sampleThrottleMs: 300,
  enableTracing: true,
  tracingResponse: true,
}
export const kmoreDataSourceConfig: DataSourceConfig<DbReplica> = {
  dataSource: {
    master,
  },
}


export const tracerConfig: AppConfig['tracerConfig'] = {
  tracingConfig: {
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      agentHost: process.env['JAEGER_AGENT_HOST'] ?? '192.168.1.248',
    },
  },
}

