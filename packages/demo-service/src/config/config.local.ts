// config for `npm run test`
import { JwtEggConfig } from '@waiting/egg-jwt'
import { EggKmoreConfig, ClientOpts } from 'egg-kmore'

import { UcModel } from './db.model'
import { kmore as kmoreDefault } from './helper'


const master = {
  ...kmoreDefault.client,
  waitConnected: false,
} as ClientOpts<UcModel>

export const kmore: EggKmoreConfig<UcModel> = {
  client: master,
}

export const jwt = {
  enable: false, // disable middleware
} as JwtEggConfig

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
