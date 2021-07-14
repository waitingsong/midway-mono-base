import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger'
import {
  DbConfig,
  DbConfigs,
  postProcessResponse,
  wrapIdentifier,
} from '@mw-components/kmore'
import {
  initTaskManClientConfig,
  ServerAgent,
  TaskManClientConfig,
  TaskManServerConfig,
} from '@mw-components/taskman'
import { JwtEggConfig } from '@waiting/egg-jwt'

import { DbReplicaKeys } from './config.types'
import { dbDict, DbModel } from './db.model'


export {
  fetch,
  jwtAuth,
} from './config.local'


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
    acquireConnectionTimeout: 10000,
    postProcessResponse,
    wrapIdentifier,
  },
  dict: dbDict,
  sampleThrottleMs: 500,
  enableTracing: true,
  tracingResponse: true,
}
export const dbConfigs: DbConfigs<DbReplicaKeys> = {
  master,
}

export const jwt = {
  enable: true, // enable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      passthrough: false,
    },
    secret: '123456abc', // 生产更新!!
  },
  ignore: [
    /^\/$/u, '/login', '/hello', '/ip', '/ping',
    '/test/sign',
    '/test/err',
    `${ServerAgent.base}/${ServerAgent.hello}`,
  ],
} as JwtEggConfig
// jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)

export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 0.0001,
    },
    reporter: {
      agentHost: process.env.JAEGER_AGENT_HOST ?? '127.0.0.1',
    },
  },
}


/**
 * Remove this variable if running as client
 */
export const taskManServerConfig: TaskManServerConfig = {
  expInterval: '30min',
  dbConfigs: {
    connection: {
      host: process.env.POSTGRES_HOST ?? '',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ?? '',
      user: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
    },
    pool: {
      min: 2,
      max: 6,
    },
  },
}
export const taskManClientConfig: TaskManClientConfig = {
  ...initTaskManClientConfig,
  host: process.env.TASK_AGENT_HOST ?? '',
}


