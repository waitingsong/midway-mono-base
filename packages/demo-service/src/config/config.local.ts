// config for `npm run test` in vscode F5
import { FetchComponentConfig, defaultFetchComponentConfig } from '@mw-components/fetch'
import { TracerConfig, defaultTracerConfig, TracerTag } from '@mw-components/jaeger'
import {
  JwtConfig,
  JwtMiddlewareConfig,
  initialJwtMiddlewareConfig,
} from '@mw-components/jwt'
import {
  DbConfig,
  DbConfigs,
  postProcessResponse,
  wrapIdentifier,
} from '@mw-components/kmore'
import {
  initTaskManClientConfig,
  initDbConfig,
  ServerAgent,
  TaskManClientConfig,
  TaskManServerConfig,
} from '@mw-components/taskman'

import {
  DbReplicaKeys,
  SvcHosts,
} from './config.types'
import { dbDict, DbModel } from './db.model'

import { HeadersKey } from '~/interface'


export const jwtConfig: JwtConfig = {
  secret: '123456abc', // 默认密钥，生产环境一定要更改!
}
export const jwtMiddlewareConfig: JwtMiddlewareConfig = {
  ...initialJwtMiddlewareConfig,
  enableMiddleware: true,
}
jwtMiddlewareConfig.ignore = jwtMiddlewareConfig.ignore?.concat([
  '/hello', '/ip',
  '/test/err',
  '/test/array',
  '/test/blank',
  '/test/empty',
  '/test/fetch',
  '/test/_fetch_target',
  '/test/no_output',
  '/test/sign',
  /test\/dump\/.*/u,
  RegExp(`${ServerAgent.base}/.*`, 'u'),
])


export const fetch: FetchComponentConfig = {
  ...defaultFetchComponentConfig,
}
fetch.traceLoggingReqHeaders.push(HeadersKey.traceId)
fetch.traceLoggingReqHeaders.push(TracerTag.svcName)
fetch.traceLoggingReqHeaders.push(TracerTag.svcVer)

fetch.traceLoggingRespHeaders.push(HeadersKey.traceId)
fetch.traceLoggingRespHeaders.push(TracerTag.svcName)
fetch.traceLoggingRespHeaders.push(TracerTag.svcVer)


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


export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  whiteList: [
    '/favicon.ico',
    '/favicon.png',
    '/ping',
    '/metrics',
  ],
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
tracer.loggingReqHeaders.push(TracerTag.svcName)
tracer.loggingReqHeaders.push(TracerTag.svcVer)

/**
 * Remove this variable if running as client
 */
export const taskManServerConfig: TaskManServerConfig = {
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
export const taskManClientConfig: TaskManClientConfig = {
  ...initTaskManClientConfig,
  host: process.env.TASK_AGENT_HOST ? process.env.TASK_AGENT_HOST : 'http://127.0.0.1:7001',
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

export const svcHosts: SvcHosts = {
  uc: 'http://127.0.0.1:7001',
}
Object.keys(svcHosts).forEach((key) => {
  const name = `SVC_HOST_${key}`
  if (typeof process.env[name] === 'string') {
    svcHosts[key] = process.env[name] as string
  }
})

