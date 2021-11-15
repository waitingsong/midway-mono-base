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

import { DbReplicaKeys } from './config.types'
import { dbDict, DbModel } from './db.model'


export {
  fetch,
  svcHosts,
} from './config.local'

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET,
}
export const jwtMiddlewareConfig: JwtMiddlewareConfig = {
  ...initialJwtMiddlewareConfig,
  enableMiddleware: true,
}
jwtMiddlewareConfig.ignore = jwtMiddlewareConfig.ignore?.concat([
  '/hello', '/ip',
  '/test/sign',
  '/test/err',
  // /debug\/dump\/.*/u,
  RegExp(`${ServerAgent.base}/.*`, 'u'),
])


const master: DbConfig<DbModel> = {
  autoConnect: true,
  config: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : '',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ? process.env.POSTGRES_DB : '',
      user: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : '',
      password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : '',
    },
    pool: {
      min: 2,
      max: 20,
      // propagateCreateError: false,
    },
    acquireConnectionTimeout: 30000,
    postProcessResponse,
    wrapIdentifier,
  },
  dict: dbDict,
  sampleThrottleMs: 500,
  enableTracing: false,
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
      param: process.env.JAEGER_SAMPLE_RATIO ? +process.env.JAEGER_SAMPLE_RATIO : 0.001,
    },
    reporter: {
      agentHost: process.env.JAEGER_AGENT_HOST ?? '127.0.0.1',
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
      host: process.env.POSTGRES_HOST ?? '',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ?? '',
      user: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
    },
    enableTracing: false,
    tracingResponse: false,
  },
}
export const taskManClientConfig: TaskManClientConfig = {
  ...initTaskManClientConfig,
  host: process.env.TASK_AGENT_HOST ?? '',
}


