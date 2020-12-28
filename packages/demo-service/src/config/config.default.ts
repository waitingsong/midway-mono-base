import { readFileSync } from 'fs'

import { join } from '@waiting/shared-core'
import { EggAppInfo } from 'egg'

import { DefaultConfig } from './config.types'
import { jwt, koid } from './helper'


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


  config.jwt = {
    ...jwt,
    client: {
      authOpts: {
        cookie: 'access_token',
        passthrough: false,
      },
      secret: config.keys, // update it!
    },
    // ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip', '/ping'],
  }
  // jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
  config.jwtAuth = {
    ignore: config.jwt.ignore,
    redisScope: 'admin', // redis的作用域前缀
    accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
  }

  config.koid = {
    ...koid,
  }

  return config
}

