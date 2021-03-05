import { Context } from 'egg'
import { EggKmoreConfig, genDbDictFromType, ClientOpts } from 'egg-kmore'

import { UcModel } from './db.model'


const master: ClientOpts<UcModel> = {
  knexConfig: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST ? process.env.PGHOST : 'localhost',
      user: process.env.PGUSER ? process.env.PGUSER : 'postgres',
      password: process.env.PGPASSWORD ? process.env.PGPASSWORD : 'postgres',
      port: process.env.PGPORT ? +process.env.PGPORT : 5432,
      database: process.env.PGDB ? process.env.PGDB : 'db_ci_test',
    },
    acquireConnectionTimeout: 10000,
  },
  dbDict: genDbDictFromType<UcModel>(),
  waitConnected: false,
}

export const kmore: EggKmoreConfig<UcModel> = {
  client: master,
}

// see: test/app/home/home.test.ts
export async function testJumpTo(ctx: Context): Promise<string | false> {
  return ctx.method === 'GET' && ctx.path === '/test_passthrough_redirect'
    ? '/test_passthrough_redirect_path'
    : false
}

