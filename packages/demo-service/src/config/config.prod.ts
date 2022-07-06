import { Config } from '@mw-components/ali-oss'
import { initialConfig as initTracerConfig, TracerTag } from '@mw-components/jaeger'
import { initialMiddlewareConfig as initialJwtMiddlewareConfig } from '@mw-components/jwt'
import {
  DataSourceConfig,
  DbConfig,
} from '@mw-components/kmore'
import {
  initDbConfig as taskInitDbConfig,
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
export const jwtMiddlewareConfig: AppConfig['jwtMiddlewareConfig'] = {
  ...initialJwtMiddlewareConfig,
  enableMiddleware: true,
}
const jwtIgnoreArr = [
  '/',
  '/hello',
  '/ip',
  '/ping',
  '/test/sign',
  '/test/err',
  // /debug\/dump\/.*/u,
  RegExp(`${ClientURL.base}/.*`, 'u'),
  RegExp(`${ServerURL.base}/.*`, 'u'),
]
jwtMiddlewareConfig.ignore = jwtMiddlewareConfig.ignore
  ? jwtMiddlewareConfig.ignore.concat(jwtIgnoreArr)
  : jwtIgnoreArr


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
  ...initTracerConfig,
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: process.env['JAEGER_SAMPLE_RATIO'] ? +process.env['JAEGER_SAMPLE_RATIO'] : 0.001,
    },
    reporter: {
      agentHost: process.env['JAEGER_AGENT_HOST'] ?? '127.0.0.1',
    },
  },
}
tracerConfig.loggingReqHeaders?.push(TracerTag.svcName)
tracerConfig.loggingReqHeaders?.push(TracerTag.svcVer)

export const tracerMiddlewareConfig: AppConfig['tracerMiddlewareConfig'] = {
  ignore: [
    '/favicon.ico',
    '/favicon.png',
    '/ping',
    '/metrics',
  ],
}


export const taskServerConfig: AppConfig['taskServerConfig'] = {
  expInterval: '30min',
  dataSource: {
    [TaskDbReplica.taskMaster]: {
      ...taskInitDbConfig,
      config: {
        connection: {
          host: process.env['POSTGRES_HOST'] ?? '',
          port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
          database: process.env['POSTGRES_DB'] ?? '',
          user: process.env['POSTGRES_USER'] ?? '',
          password: process.env['POSTGRES_PASSWORD'] ?? '',
        },
      },
      enableTracing: false,
      tracingResponse: false,
    },
  },
}
export const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env['TASK_AGENT_HOST'] ?? '',
}

export const taskMiddlewareConfig: AppConfig['taskMiddlewareConfig'] = {
  enableMiddleware: true,
  ignore: ['/'],
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

