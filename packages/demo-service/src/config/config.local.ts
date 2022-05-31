// config for `npm run test` in vscode F5
import { Config } from '@mw-components/ali-oss'
import { initialConfig as initFetchConfig } from '@mw-components/fetch'
import { initialConfig as initTracerConfig, TracerTag } from '@mw-components/jaeger'
import { initialMiddlewareConfig as initialJwtMiddlewareConfig } from '@mw-components/jwt'
import {
  DbConfig,
  DbConfigs,
  postProcessResponse,
  wrapIdentifier,
} from '@mw-components/kmore'
import {
  initDbConfig,
  ClientURL,
  ServerURL,
} from '@mw-components/taskman'

import {
  DbReplicaKeys,
  SvcHosts,
} from './config.types'
import { dbDict, DbModel } from './db.model'

import { HeadersKey, AppConfig } from '~/interface'


export const jwtConfig: AppConfig['jwtConfig'] = {
  secret: '123456abc', // 默认密钥，生产环境一定要更改!
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
jwtMiddlewareConfig.ignore = jwtMiddlewareConfig.ignore
  ? jwtMiddlewareConfig.ignore.concat(jwtIgnoreArr)
  : jwtIgnoreArr


export const fetchConfig: AppConfig['fetchConfig'] = {
  ...initFetchConfig,
}
fetchConfig.traceLoggingReqHeaders?.push(HeadersKey.traceId)
fetchConfig.traceLoggingReqHeaders?.push(TracerTag.svcName)
fetchConfig.traceLoggingReqHeaders?.push(TracerTag.svcVer)

fetchConfig.traceLoggingRespHeaders?.push(HeadersKey.traceId)
fetchConfig.traceLoggingRespHeaders?.push(TracerTag.svcName)
fetchConfig.traceLoggingRespHeaders?.push(TracerTag.svcVer)


const master: DbConfig<DbModel> = {
  autoConnect: true,
  config: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'db_ci_mw',
      user: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres',
      password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'postgres',
    },
    pool: {
      min: 0,
      max: 20,
      /** @link https://stackoverflow.com/a/67621567 */
      // propagateCreateError: false,
    },
    acquireConnectionTimeout: 50000,
    postProcessResponse,
    wrapIdentifier,
  },
  dict: dbDict,
  sampleThrottleMs: 10,
  enableTracing: true,
  tracingResponse: true,
}
export const dbConfigs: DbConfigs<DbReplicaKeys> = {
  master,
}


export const tracerConfig: AppConfig['tracerConfig'] = {
  ...initTracerConfig,
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 1,
    },
    reporter: {
      agentHost: process.env.JAEGER_AGENT_HOST ?? '192.168.1.248',
    },
  },
}
tracerConfig.loggingReqHeaders?.push(TracerTag.svcName)
tracerConfig.loggingReqHeaders?.push(TracerTag.svcVer)


export const taskServerConfig: AppConfig['taskServerConfig'] = {
  expInterval: '30min',
  dbConfigs: {
    ...initDbConfig,
    connection: {
      host: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'db_ci_mw',
      user: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres',
      password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'postgres',
    },
    tracingResponse: true,
  },
}

export const taskClientConfig: AppConfig['taskClientConfig'] = {
  host: process.env.TASK_AGENT_HOST ? process.env.TASK_AGENT_HOST : 'http://127.0.0.1:7001',
}

export const taskMiddlewareConfig: AppConfig['taskMiddlewareConfig'] = {
  enableMiddleware: true,
  ignore: ['/'],
}

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


export enum OssClientKey {
  ossmain = 'ossmain',
}
const clientConfig = {
  accessKeyId: process.env.ALI_OSS_AID ?? '',
  accessKeySecret: process.env.ALI_OSS_ASECRET ?? '',
  endpoint: process.env.ALI_OSS_ENDPOINT ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env.ALI_OSS_BUCKET ?? '',
  cmd: 'ossutil',
  debug: false,
}
export const aliOssConfig: Readonly<Config<OssClientKey>> = {
  ossmain: clientConfig,
}


export const svcHosts: SvcHosts = {
  uc: 'http://127.0.0.1:7001',
}
Object.keys(svcHosts).forEach((key) => {
  const name = `SVC_HOST_${key}`
  if (typeof process.env[name] === 'string') {
    svcHosts[key] = process.env[name] as string
  }
})

