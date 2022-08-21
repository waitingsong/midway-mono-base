import { AliOssSourceConfig } from '@mw-components/ali-oss'
import type {
  AppConfig,
  Context,
} from '@mw-components/base'
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
import { ErrorCode } from '@scope/docs'

import {
  DbReplica,
  OssClientKey,
  SvcHosts,
} from './config.types'
import { dbDict, DbModel } from './db.model'


const jwtIgnoreArr = [
  ...initPathArray,
  '/',
  '/hello',
  '/ip',
  '/ping',
  '/test/sign',
  '/test/err',
  RegExp(`${ClientURL.base}/.*`, 'u'),
  RegExp(`${ServerURL.base}/.*`, 'u'),
]
const jwtMiddlewareConfig: AppConfig['jwtMiddlewareConfig'] = {
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
const kmoreConfig: KmoreSourceConfig<DbReplica> = {
  dataSource: {
    master,
  },
}


const tracerConfig: AppConfig['tracerConfig'] = {
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


const taskServerConfig: AppConfig['taskServerConfig'] = {
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
const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env['TASK_AGENT_HOST'] ?? '',
}


const clientConfig = {
  accessKeyId: process.env['ALI_OSS_AID'] ?? '',
  accessKeySecret: process.env['ALI_OSS_ASECRET'] ?? '',
  endpoint: process.env['ALI_OSS_ENDPOINT'] ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env['ALI_OSS_BUCKET'] ?? '',
}
const aliOssConfig: AliOssSourceConfig<OssClientKey> = {
  dataSource: {
    ossMain: clientConfig,
  },
}


const svcHosts: SvcHosts = {
  uc: 'http://127.0.0.1:7001',
}
Object.keys(svcHosts).forEach((key) => {
  const name = `SVC_HOST_${key}`
  if (typeof process.env[name] === 'string') {
    svcHosts[key] = process.env[name] as string
  }
})


const appConfig: AppConfig = {
  keys: '1559532739677_8888',
  aliOssConfig,
  globalErrorCode: ErrorCode,
  jwtConfig: {
    secret: process.env['JWT_SECRET'],
  },
  jwtMiddlewareConfig,
  kmoreConfig,
  svcHosts,
  taskClientConfig,
  taskServerConfig,
  tracerConfig,
}
export default appConfig

