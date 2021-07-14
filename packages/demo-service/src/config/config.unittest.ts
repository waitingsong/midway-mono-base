// config for `npm run cov|ci`
import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger'
import {
  DbConfig,
  DbConfigs,
  postProcessResponse,
  wrapIdentifier,
} from '@mw-components/kmore'
import { ServerAgent } from '@mw-components/taskman'
import { JwtEggConfig } from '@waiting/egg-jwt'

import { DbReplicaKeys } from './config.types'
import { DbModel, dbDict } from './db.model'
import { testJumpTo } from './helper'


export {
  fetch,
  taskManClientConfig,
  taskManServerConfig,
} from './config.local'

export const security = {
  csrf: false,
}

// 建议跑测试的时候关闭日志(true)，这样手动故意触发的错误，都不会显示处理。如果想看则打开(false)
export const logger = {
  disableConsoleAfterReady: true,
}

export const jwt: JwtEggConfig = {
  enable: true, // enable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      // @ts-expect-error
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
}

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
  sampleThrottleMs: 300,
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
    '/untracedPath',
    '',
    /\/unitTest[\d.]+/u,
  ],
  tracingConfig: {
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      agentHost: process.env.JAEGER_AGENT_HOST ?? '192.168.1.248',
    },
  },
}

