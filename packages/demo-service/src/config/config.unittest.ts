// config for `npm run cov|ci`

export * from './db/db.config.unittest.js'
export * from './jwt/jwt.config.unittest.js'
export * from './pgmq/pgmq.config.default.js'


// 建议跑测试的时候关闭日志(true)，这样手动故意触发的错误，都不会显示处理。如果想看则打开(false)
export const logger = {
  disableConsoleAfterReady: true,
}


