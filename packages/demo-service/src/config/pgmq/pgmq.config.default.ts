import { type DbConfig, type DbConnectionConfig, type PgmqConfig as Config, initDbConfig } from '@mwcp/pgmq'


const connection: DbConnectionConfig = {
  ...initDbConfig.connection,
}
const dbConfig: DbConfig = {
  ...initDbConfig,
  connection,
}

export const pgmqConfig: Config = {
  enableDefaultRoute: false,
  enableApi: false,
  dataSource: {
    default: dbConfig,
  },
  defaultDataSourceName: 'default',
}

