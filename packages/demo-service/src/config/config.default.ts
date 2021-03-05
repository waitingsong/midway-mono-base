import { readFileSync } from 'fs'

import { join } from '@waiting/shared-core'
import { EggAppInfo } from 'egg'
import { KoidEggConfig } from 'egg-koid'

import { DefaultConfig } from './config.types'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig

  // add your config here
  config.middleware = ['jwtAuthMiddleware']

  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name}_1559532739676_8888`

  const buf = readFileSync(join(appInfo.baseDir, 'app/public/favicon.png'))
  config.siteFile = {
    '/favicon.ico': buf,
    '/favicon.png': buf,
  }

  // switch by plugin.ts:cors.enable
  config.cors = {
    origin: '*',
    // allowMethods: 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
    allowMethods: 'GET,HEAD,OPTIONS,POST',
    maxAge: 600,
  }

  config.welcomeMsg = 'Hello Midwayjs!'

  config.svcHosts = {
    uc: 'http://127.0.0.1:7001',
  }
  Object.keys(config.svcHosts).forEach((key) => {
    const name = `SVC_HOST_${key}`
    if (typeof process.env[name] === 'string') {
      config.svcHosts[key] = process.env[name] as string
    }
  })

  // '2000-01-01T00:00:00Z'
  const epoch = 946684800000
  config.koid = {
    client: {
      koidConfig: {
        dataCenter: process.env.KOID_DATACENTER ? +process.env.KOID_DATACENTER : 0,
        worker: process.env.KOID_WORKER ? +process.env.KOID_WORKER : 0,
        epoch,
      },
    },
  } as KoidEggConfig

  config.jwt = {
    enable: true, // enable middleware
    client: {
      authOpts: {
        cookie: 'access_token',
        passthrough: false,
      },
      secret: '123456abc', // 生产更新!!
    },
    ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip', '/ping', '/test_err/'],
  }

  // jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
  config.jwtAuth = {
    ignore: config.jwt.ignore,
    redisScope: 'admin', // redis的作用域前缀
    accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
  }


  return config
}

