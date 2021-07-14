// config for `npm run test` in vscode F5
import { FetchComponentConfig, defaultFetchComponentConfig } from '@mw-components/fetch'
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

import { DbReplicaKeys, JwtAuthMiddlewareConfig } from './config.types'
import { dbDict, DbModel } from './db.model'
import { testJumpTo } from './helper'


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
    acquireConnectionTimeout: 10000,
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

export const jwt = {
  enable: false, // disable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      passthrough: testJumpTo,
    },
    secret: '123456abc',
  },
  ignore: [
    /^\/$/u, '/login', '/hello', '/ip', '/ping',
    '/test/err',
    '/test/array',
    '/test/blank',
    '/test/empty',
    '/test/no_output',
    '/test/sign',
    `${ServerAgent.base}/*`,
  ],
} as JwtEggConfig
// jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
export const jwtAuth: JwtAuthMiddlewareConfig = {
  ignore: jwt.ignore,
  redisScope: 'admin', // redis的作用域前缀
  accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
}

export const tracer: TracerConfig = {
  ...defaultTracerConfig,
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

export const fetch: FetchComponentConfig = {
  ...defaultFetchComponentConfig,
}


/**
 * Remove this variable if running as client
 */
export const taskManServerConfig: TaskManServerConfig = {
  expInterval: '30min',
  dbConfigs: {
    connection: {
      host: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      database: process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'db_ci_mw',
      user: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres',
      password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'postgres',
    },
    pool: {
      min: 2,
      max: 6,
    },
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

