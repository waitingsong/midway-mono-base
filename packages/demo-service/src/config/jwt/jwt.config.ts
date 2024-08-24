import assert from 'node:assert'

import type { AppConfig } from '@mwcp/boot'
import { initPathArray } from '@mwcp/jwt'

import { keys } from '##/config/key/key.config.js'


export const jwtConfig = {
  secret: process.env['JWT_SECRET'] ?? keys,
}
assert(jwtConfig.secret, 'JWT secret is empty')
const jwtIgnoreArr = [
  ...initPathArray,
  '/',
  '/hello',
  '/ip',
  '/ping',
]
export const jwtMiddlewareConfig: AppConfig['jwtMiddlewareConfig'] = {
  enableMiddleware: true,
  ignore: jwtIgnoreArr,
}

