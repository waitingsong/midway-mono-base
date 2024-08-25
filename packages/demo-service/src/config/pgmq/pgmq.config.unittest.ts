import { type PgmqConfig as Config, type DbConnectionConfig, type DbConfig, initDbConfig } from '@mwcp/pgmq'


const connection: DbConnectionConfig = {
  ...initDbConfig.connection,
}
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

