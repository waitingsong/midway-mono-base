import { join } from 'node:path'

import { genCurrentDirname } from '@waiting/shared-core'

import { ErrorCode } from '##/types.js'



export * from './key/key.config.js'
export * from './misc/env.config.js'
export * from './alioss/alioss.config.js'
export * from './db/db.config.js'
export * from './jwt/jwt.config.js'
export * from './otel/otel.config.js'
export * from './swagger/swagger.config.js'


const configDir = genCurrentDirname(import.meta.url)
export const APP_BASE_DIR = join(configDir, '../..')
// 调试、单测时指向src目录，其余指向dist目录
export const APP_DIST_DIR = join(configDir, '../')
console.info({ APP_BASE_DIR, APP_DIST_DIR })

export const globalErrorCode = ErrorCode

export const jsonRespMiddlewareConfig = {
  enableMiddleware: true,
}


