import { DefaultConfig as PrometheusConfig } from '@midwayjs/prometheus'
import { Jwt, JwtEggConfig } from '@waiting/egg-jwt'
import { NpmPkg } from '@waiting/shared-types'
import { EggAppConfig, PowerPartial } from 'egg'


export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  welcomeMsg: string
  svcHosts: SvcHosts
}

declare module 'egg' {
  interface Application {
    jwt: Jwt
  }

  interface EggAppConfig {
    coreMiddleware: string[]
    pkgJson: NpmPkg
    prometheus: PrometheusConfig
  }
}


export interface SvcHosts {
  uc: string
  [srv: string]: string
}


export const enum DbReplica {
  master = 'master',
  // slave = 'slave',
}
export type DbReplicaKeys = keyof typeof DbReplica


/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number
  ignore: JwtEggConfig['ignore']
  /** redis的作用域前缀 */
  redisScope: string
}

