import { readFileSync } from 'fs'

import { join } from '@waiting/shared-core'
import { EggAppInfo } from 'egg'

import { DefaultConfig } from './config.types'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig

  // add your config here
  config.middleware = ['jwtAuthMiddleware', 'responseMimeMiddleware']

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

  config.midwayFeature = {
    // true 使用 midway-logger
    // false 或空代表使用 egg-logger
    replaceEggLogger: true,
  }

  config.svcHosts = {
    uc: 'http://127.0.0.1:7001',
  }
  Object.keys(config.svcHosts).forEach((key) => {
    const name = `SVC_HOST_${key}`
    if (typeof process.env[name] === 'string') {
      config.svcHosts[key] = process.env[name] as string
    }
  })

  // '2020-01-01T00:00:00Z'
  const epoch = 1577836800000
  config.koid = {
    dataCenter: process.env.KOID_DATACENTER ? +process.env.KOID_DATACENTER : 0,
    worker: process.env.KOID_WORKER ? +process.env.KOID_WORKER : 0,
    epoch,
  }

  // prometheus config
  config.prometheus = {
    labels: {
      APP_NAME: appInfo.name,
    },
  }

  // 禁用 csrf 安全检测
  config.security = {
    csrf: {
      enable: false,
    },
  }

  return config
}

