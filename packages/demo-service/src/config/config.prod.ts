import { Config } from '@mw-components/ali-oss'
import {
  DataSourceConfig,
  DbConfig,
} from '@mw-components/kmore'
import {
  ClientURL,
  DbReplica as TaskDbReplica,
  ServerURL,
} from '@mw-components/taskman'

import { DbReplica } from './config.types'
import { dbDict, DbModel } from './db.model'

import type { AppConfig, Context } from '~/interface'


export { svcHosts } from './config.local'

export const jwtConfig: AppConfig['jwtConfig'] = {
  secret: process.env['JWT_SECRET'],
}
const jwtIgnoreArr = [
  '/',
  '/hello',
  '/ip',
  '/ping',
  '/test/sign',
  '/test/err',
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
      host: process.env['POSTGRES_HOST'] ? process.env['POSTGRES_HOST'] : '',
      port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
      database: process.env['POSTGRES_DB'] ? process.env['POSTGRES_DB'] : '',
      user: process.env['POSTGRES_USER'] ? process.env['POSTGRES_USER'] : '',
      password: process.env['POSTGRES_PASSWORD'] ? process.env['POSTGRES_PASSWORD'] : '',
    },
    pool: {
      min: 0,
      max: 30,
      // propagateCreateError: false,
    },
    acquireConnectionTimeout: 30000,
  },
  dict: dbDict,
  sampleThrottleMs: 500,
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
      type: 'probabilistic',
      param: process.env['JAEGER_SAMPLE_RATIO'] ? +process.env['JAEGER_SAMPLE_RATIO'] : 0.1,
    },
    reporter: {
      agentHost: process.env['JAEGER_AGENT_HOST'] ?? '127.0.0.1',
    },
  },
}


export const taskServerConfig: AppConfig['taskServerConfig'] = {
  dataSource: {
    [TaskDbReplica.taskMaster]: {
      config: {
        connection: {
          host: process.env['POSTGRES_HOST'] ?? '',
          port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
          database: process.env['POSTGRES_DB'] ?? '',
          user: process.env['POSTGRES_USER'] ?? '',
          password: process.env['POSTGRES_PASSWORD'] ?? '',
        },
      },
    },
  },
}
export const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env['TASK_AGENT_HOST'] ?? '',
}


export enum OssClientKey {
  ossmain = 'ossmain',
}
const clientConfig = {
  accessKeyId: process.env['ALI_OSS_AID'] ?? '',
  accessKeySecret: process.env['ALI_OSS_ASECRET'] ?? '',
  endpoint: process.env['ALI_OSS_ENDPOINT'] ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env['ALI_OSS_BUCKET'] ?? '',
  cmd: 'ossutil',
  debug: false,
}
export const aliOssConfig: Readonly<Config<OssClientKey>> = {
  ossmain: clientConfig,
}

