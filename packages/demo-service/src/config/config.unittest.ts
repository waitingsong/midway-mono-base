// config for `npm run cov|ci`
import { JwtEggConfig } from '@waiting/egg-jwt'

import { testJumpTo } from './helper'


export const security = {
  csrf: false,
}

// 建议跑测试的时候关闭日志(true)，这样手动故意触发的错误，都不会显示处理。如果想看则打开(false)
export const logger = {
  disableConsoleAfterReady: true,
}

export const jwt: JwtEggConfig = {
  enable: true, // enable middleware
  client: {
    authOpts: {
      cookie: 'access_token',
      passthrough: testJumpTo,
    },
    secret: '123456abc',
  },
  ignore: [/^\/$/u, '/login', '/hello', '/test_sign', '/ip', '/ping', '/test_err/'],
}

