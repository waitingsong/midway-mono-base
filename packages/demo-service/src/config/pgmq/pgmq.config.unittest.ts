import { type DbConfig, type DbConnectionConfig, type PgmqConfig as Config, initDbConfig } from '@mwcp/pgmq'


const connection: DbConnectionConfig = {
  ...initDbConfig.connection,
}
// connection.port = 5432

const dbConfig: DbConfig = {
  ...initDbConfig,
  connection,
}

export const pgmqConfig: Config = {
  enableDefaultRoute: true,
  enableApi: true,
  dataSource: {
    default: dbConfig,
  },
  defaultDataSourceName: 'default',
}

