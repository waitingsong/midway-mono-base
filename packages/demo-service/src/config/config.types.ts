import { DefaultConfig as PrometheusConfig } from '@midwayjs/prometheus'
import { NpmPkg } from '@waiting/shared-types'
import { EggAppConfig, PowerPartial } from 'egg'


export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  welcomeMsg: string
  svcHosts: SvcHosts
}

declare module 'egg' {
  interface EggAppConfig {
    coreMiddleware: string[]
    pkgJson: NpmPkg
    prometheus: PrometheusConfig
  }
}


export const enum DbReplica {
  master = 'master',
}
export type DbReplicaKeys = keyof typeof DbReplica

/**
 * 远程服务主机配置，结尾不应带有斜杠 '/'
 */
export interface SvcHosts {
  uc: string
  [srv: string]: string
}
