import { JwtEggConfig } from '@waiting/egg-jwt'
import { Context } from 'egg'
import { EggKmoreConfig, genDbDictFromType, ClientOpts } from 'egg-kmore'
import { KoidEggConfig } from 'egg-koid'

import { UcModel } from './db.model'


const master: ClientOpts<UcModel> = {
  knexConfig: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      user: process.env.PGUSER ? process.env.PGUSER : 'postgres',
      password: process.env.PGPASSWORD ? process.env.PGPASSWORD : '',
      database: 'db_ci_test',
    },
    acquireConnectionTimeout: 10000,
  },
  dbDict: genDbDictFromType<UcModel>(),
  waitConnected: false,
}

export const kmore: EggKmoreConfig<UcModel> = {
  client: master,
}

export const jwt: JwtEggConfig = {
  enable: true, // enable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      passthrough: testJumpTo,
    },
    secret: '123456abc',
  },
  ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip', '/ping', '/test_err/'],
}

// see: test/app/home/home.test.ts
async function testJumpTo(ctx: Context): Promise<string | false> {
  return ctx.method === 'GET' && ctx.path === '/test_passthrough_redirect'
    ? '/test_passthrough_redirect_path'
    : false
}

// '2000-01-01T00:00:00Z'
const epoch = 946684800000

export const koid: KoidEggConfig = {
  client: {
    koidConfig: {
      dataCenter: process.env.KOID_DATACENTER ? +process.env.KOID_DATACENTER : 0,
      worker: process.env.KOID_WORKER ? +process.env.KOID_WORKER : 0,
      epoch,
    },
  },
}

