import { JwtState } from '@mw-components/jwt'

import { JwtUser } from './types'


declare module '@midwayjs/koa/dist/interface' {
  interface Context {
    jwtState: JwtState<JwtUser>
  }
}


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'

