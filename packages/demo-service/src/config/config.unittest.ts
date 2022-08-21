// config for `npm run cov|ci`
import type { AppConfig } from '@mw-components/base'
import { initPathArray } from '@mw-components/jwt'
import {
  DbConfig,
  KmoreSourceConfig,
} from '@mw-components/kmore'
import {
  ClientURL,
  DbReplica as TaskDbReplica,
  ServerURL,
} from '@mw-components/taskman'

import { DbReplica } from './config.types'


export const security = {
  csrf: false,
}

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
  '/test/fetch',
  '/test/_fetch_target',
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


const master: DbConfig = {
  config: {
    connection: {
      host: process.env['POSTGRES_HOST'] ? process.env['POSTGRES_HOST'] : 'localhost',
      port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
      database: process.env['POSTGRES_DB'] ? process.env['POSTGRES_DB'] : 'db_ci_mw',
      user: process.env['POSTGRES_USER'] ? process.env['POSTGRES_USER'] : 'postgres',
      password: process.env['POSTGRES_PASSWORD'] ? process.env['POSTGRES_PASSWORD'] : 'postgres',
    },
  },
  enableTracing: true,
  tracingResponse: true,
}
export const kmoreConfig: KmoreSourceConfig<DbReplica> = {
  dataSource: {
    master,
  },
}


export const tracerConfig: AppConfig['tracerConfig'] = {
  tracingConfig: {
    reporter: {
      agentHost: process.env['JAEGER_AGENT_HOST'] ?? '192.168.1.248',
    },
  },
}


export const taskServerConfig: AppConfig['taskServerConfig'] = {
  dataSource: {
    [TaskDbReplica.taskMaster]: {
      config: {
        connection: {
          host: process.env['POSTGRES_HOST'] ? process.env['POSTGRES_HOST'] : 'localhost',
          port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
          database: process.env['POSTGRES_DB'] ? process.env['POSTGRES_DB'] : 'db_ci_mw',
          user: process.env['POSTGRES_USER'] ? process.env['POSTGRES_USER'] : 'postgres',
          password: process.env['POSTGRES_PASSWORD'] ? process.env['POSTGRES_PASSWORD'] : 'postgres',
        },
      },
      sampleThrottleMs: 1000,
    },
  },
}
export const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env['TASK_AGENT_HOST'] ? process.env['TASK_AGENT_HOST'] : 'http://127.0.0.1:7001',
}

