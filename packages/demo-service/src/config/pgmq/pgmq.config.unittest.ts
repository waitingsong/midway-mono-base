import { initDbConfig } from '@mwcp/pgmq'
import type { PgmqConfig as Config } from '@mwcp/pgmq'


export const pgmqConfig: Config = {
  enableDefaultRoute: false,
  enableApi: false,
  dataSource: {
    default: {
      ...initDbConfig,
    },
  },
  defaultDataSourceName: 'default',
}

