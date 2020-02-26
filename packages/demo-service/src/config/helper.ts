import { Context } from 'midway'
import { EggKmoreConfig, genTbListFromType, ClientOpts } from 'egg-kmore'
import { JwtConfig } from '@waiting/egg-jwt'

import { UcTbListModel } from './db.model'


const master: ClientOpts = {
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
  tables: genTbListFromType<UcTbListModel>(),
}

export const kmore: EggKmoreConfig = {
  client: master,
}

export const jwt: JwtConfig = {
  enable: true, // enable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      key: 'user',
      passthrough: testJumpTo,
    },
    secret: '123456abc',
  },
  ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip', '/ping'],
}

// see: test/app/home/home.test.ts
async function testJumpTo(ctx: Context) {
  return ctx.method === 'GET' && ctx.path === '/test_passthrough_redirect'
    ? '/test_passthrough_redirect_path'
    : false
}

