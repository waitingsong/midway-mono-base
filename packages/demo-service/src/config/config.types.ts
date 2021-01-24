import { Jwt, JwtEggConfig, JwtState } from '@waiting/egg-jwt'
import { EggAppConfig, PowerPartial } from 'egg'
import { KnexConfig } from 'egg-kmore'
import { Koid, KoidEggConfig } from 'egg-koid'


export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  welcomeMsg: string
  jwt: JwtEggConfig
  jwtAuth: JwtAuthMiddlewareConfig
  koid: KoidEggConfig
  svcHosts: SvcHosts
}

export interface SvcHosts {
  uc: string
  [srv: string]: string
}


export const enum DbReplica {
  master = 'pg主库',
  // slave = 'pg从库',
}
export type DbReplicaKeys = keyof typeof DbReplica
export type DbConfigList = {
  readonly [name in DbReplicaKeys]: Readonly<KnexConfig>
}

/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number
  ignore: JwtEggConfig['ignore']
  /** redis的作用域前缀 */
  redisScope: string
}

declare module 'egg' {
  interface Application {
    jwt: Jwt
    koid: Koid
  }

  interface Context {
    jwtState?: JwtState
  }

  interface EggAppConfig {
    jwt: JwtEggConfig
    jwtAuth: JwtAuthMiddlewareConfig
    koid: KoidEggConfig
  }

}

