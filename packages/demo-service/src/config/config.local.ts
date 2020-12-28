// config for `npm run test`
import { JwtConfig } from '@waiting/egg-jwt'
import { EggKmoreConfig, ClientOpts } from 'egg-kmore'

import { UcModel } from './db.model'
import { jwt as jwtConfig, kmore as kmoreDefault } from './helper'


export { koid } from './helper'


const master = {
  ...kmoreDefault.client,
  waitConnected: false,
} as ClientOpts<UcModel>

export const kmore: EggKmoreConfig<UcModel> = {
  client: master,
}

const jwt: JwtConfig = {
  // 必须展开赋值，不得直接修改属性！
  ...jwtConfig,
  enable: false,
}
export { jwt }

export const development = {
  watchDirs: [
    'agent.ts',
    'app.ts',
    'interface.ts',
    'app',
    'config',
    'lib',
    'middleware',
    'service',
  ],
  overrideDefault: true,
}
