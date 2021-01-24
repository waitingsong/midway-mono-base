// config for `npm run test`
import { JwtEggConfig } from '@waiting/egg-jwt'
import { EggKmoreConfig, ClientOpts } from 'egg-kmore'

import { UcModel } from './db.model'
import { jwt as jwtEggConfig, kmore as kmoreDefault } from './helper'


export { koid } from './helper'


const master = {
  ...kmoreDefault.client,
  waitConnected: false,
} as ClientOpts<UcModel>

export const kmore: EggKmoreConfig<UcModel> = {
  client: master,
}

const jwt: JwtEggConfig = {
  // 必须展开赋值，不得直接修改属性！
  ...jwtEggConfig,
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
