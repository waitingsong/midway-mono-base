import { EggAppConfig, PowerPartial } from 'midway'
import { JwtConfig } from '@waiting/egg-jwt'
import { Config } from 'egg-kmore'


export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  welcomeMsg: string
  jwt: JwtConfig
  svcHosts: SvcHosts
}

export interface SvcHosts {
  uc: string
  [srv: string]: string
}


export const enum DbName {
  master = 'pg主库',
  // slave = 'pg从库',
}
export type DbNameKeys = keyof typeof DbName
export type DbConfigList = {
  readonly [name in DbNameKeys]: Readonly<Config>
}

