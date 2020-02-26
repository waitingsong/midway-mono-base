import { readFileSync } from 'fs'

import { EggAppInfo } from 'midway'
import { join } from '@waiting/shared-core'

import { DefaultConfig } from './config.modal'


export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

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

  config.welcomeMsg = 'Hello midwayjs!'

  config.svcHosts = {
    uc: 'http://127.0.0.1:7001',
  }

  config.jwt = {
    enable: true, // enable middleware
    client: {
      authOpts: {
        cookie: 'access_token',
        key: 'user',
        passthrough: false,
      },
      secret: config.keys, // update it!
    },
    ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip'],
  }

  return config
}
