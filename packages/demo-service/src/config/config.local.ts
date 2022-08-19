// config for `npm run test` in vscode F5
import { DataSourceConfig as AliOssDataSourceConfig } from '@mw-components/ali-oss'
import { initPathArray } from '@mw-components/jwt'
import {
  DataSourceConfig,
  DbConfig,
} from '@mw-components/kmore'
import type {
  AppConfig,
  Context,
} from '@mw-components/share'
import {
  ClientURL,
  DbReplica as TaskDbReplica,
  ServerURL,
} from '@mw-components/taskman'

import {
  DbReplica,
  OssClientKey,
} from './config.types'
import { dbDict, DbModel } from './db.model'


export const development = {
  watchDirs: [
    'agent.ts',
    'app.ts',
    'interface.ts',
    'app',
    'config',
    'lib',
    'middleware',
    'service',
  ],
  overrideDefault: true,
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
      min: 0,
      max: 30,
      /** @link https://stackoverflow.com/a/67621567 */
      // propagateCreateError: false,
    },
  },
  dict: dbDict,
  sampleThrottleMs: 10,
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


const clientConfig = {
  accessKeyId: process.env['ALI_OSS_AID'] ?? '',
  accessKeySecret: process.env['ALI_OSS_ASECRET'] ?? '',
  endpoint: process.env['ALI_OSS_ENDPOINT'] ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env['ALI_OSS_BUCKET'] ?? '',
}
export const aliOssDataSourceConfig: AliOssDataSourceConfig<OssClientKey> = {
  dataSource: {
    ossMain: clientConfig,
  },
}



