
// @ts-ignore
declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    welcomeMsg: string
    svcHosts: SvcHosts
  }
}


export const enum DbReplica {
  master = 'master',
}
export type DbReplicaKeys = keyof typeof DbReplica


export enum OssClientKey {
  ossmain = 'ossMain',
}

/**
 * 远程服务主机配置，结尾不应带有斜杠 '/'
 */
export interface SvcHosts {
  uc: string
  [srv: string]: string
}
