import { readFileSync } from 'fs'

import { DefaultConfig as PromConfig } from '@midwayjs/prometheus'
import { join } from '@waiting/shared-core'
import { EggAppInfo } from 'egg'

import { DefaultConfig } from './config.types'

import { NpmPkg } from '~/interface'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig

  // add your config here
  config.middleware = ['responseMimeMiddleware']

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

  // '2020-01-01T00:00:00Z'
  const epoch = 1577836800000
  config.koid = {
    epoch,
  }

  const nameNorm = (appInfo.pkg as NpmPkg).name.replace(/@/ug, '').replace(/\//ug, '-')
  // prometheus config
  const prometheus: PromConfig = {
    labels: {
      APP_NAME: (appInfo.pkg as NpmPkg).name,
      APP_NAME_NORM: nameNorm,
      APP_VER: (appInfo.pkg as NpmPkg).version,
    },
  }
  config.prometheus = prometheus

  // 禁用 csrf 安全检测
  config.security = {
    csrf: {
      enable: false,
    },
  }

  return config
}

