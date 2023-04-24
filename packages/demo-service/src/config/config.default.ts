import { AliOssConfig } from '@mwcp/ali-oss'
import type {
  AppConfig,
  Context,
} from '@mwcp/boot'
import { initPathArray } from '@mwcp/jwt'
import {
  DbConfig,
  KmoreSourceConfig,
} from '@mwcp/kmore'
import {
  ClientURL,
  DbReplica as TaskDbReplica,
  ServerURL,
  SupportTaskMapType,
} from '@mwcp/taskman'
import { ErrorCode } from '@scope/docs'

import {
  DbReplica,
  OssClientKey,
  SvcHosts,
} from './config.types'
import { dbDict, DbModel } from './db.model'


const jwtConfig = {
  secret: process.env['JWT_SECRET'],
}
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
    client: 'pgnative',
    connection: {
      host: process.env['POSTGRES_HOST'] ? process.env['POSTGRES_HOST'] : 'localhost',
      port: process.env['POSTGRES_PORT'] ? +process.env['POSTGRES_PORT'] : 5432,
      database: process.env['POSTGRES_DB'] ? process.env['POSTGRES_DB'] : 'db_ci_mw',
      user: process.env['POSTGRES_USER'] ? process.env['POSTGRES_USER'] : 'postgres',
      password: process.env['POSTGRES_PASSWORD'] ? process.env['POSTGRES_PASSWORD'] : 'postgres',
      statement_timeout: 30000, // in milliseconds
    },
    pool: {
      min: 0,
      max: 30,
      // propagateCreateError: false,
    },
    acquireConnectionTimeout: 30000,
  },
  dict: dbDict,
  traceInitConnection: true,
}
const kmoreConfig: KmoreSourceConfig<DbReplica> = {
  dataSource: {
    master,
  },
}

const exporterEndpoint = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://localhost:4317'
const otlpGrpcExporterConfig: AppConfig['otlpGrpcExporterConfig'] = {
  url: exporterEndpoint,
}


const taskServerConfig: AppConfig['taskServerConfig'] = {
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
      traceInitConnection: true,
    },
  },
}
const supportTaskMap: SupportTaskMapType = new Map([ [1, '*'] ])
const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env['TASK_AGENT_HOST'] ? process.env['TASK_AGENT_HOST'] : 'http://127.0.0.1:7001',
  supportTaskMap,
}


const clientConfig = {
  accessKeyId: process.env['ALI_OSS_AID'] ?? '',
  accessKeySecret: process.env['ALI_OSS_ASECRET'] ?? '',
  endpoint: process.env['ALI_OSS_ENDPOINT'] ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env['ALI_OSS_BUCKET'] ?? '',
}
const aliOssConfig: AliOssConfig<OssClientKey> = {
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
  jwtConfig,
  jwtMiddlewareConfig,
  kmoreConfig,
  svcHosts,
  otlpGrpcExporterConfig,
  exporterEndpoint,
  taskClientConfig,
  taskServerConfig,
}
export default appConfig

