import type { DbConfig, KmoreSourceConfig } from '@mwcp/kmore'

import type { DbModel } from './db.model.js'
import { dbDict } from './db.model.js'
import type { DbReplica } from './db.types.js'


export const master: DbConfig<DbModel> = {
  config: {
    /**
     * install "pg-native" dependency before use 'pgnative' client
     */
    client: 'pg',
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
    acquireConnectionTimeout: 10000,
  },
  dict: dbDict,
  traceInitConnection: true,
}
export const kmoreConfig: KmoreSourceConfig<DbReplica> = {
  dataSource: {
    master,
  },
}

