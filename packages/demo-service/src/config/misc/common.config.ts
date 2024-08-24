import { join } from 'node:path'

import { genCurrentDirname } from '@waiting/shared-core'


const configDir = genCurrentDirname(import.meta.url)
export const APP_BASE_DIR = join(configDir, '../../..')
// 调试、单测时指向src目录，其余指向dist目录
export const APP_DIST_DIR = join(configDir, '../..')
console.info({ APP_BASE_DIR, APP_DIST_DIR })


export const jsonRespMiddlewareConfig = {
  enableMiddleware: true,
}

