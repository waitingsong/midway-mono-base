import { JwtState } from '@mwcp/jwt'

import { JwtUser } from './types'


declare module '@midwayjs/koa/dist/interface' {
  interface Context {
    // @ts-ignore
    jwtState: JwtState<JwtUser>
  }
}


export { BaseController } from './core/base.controller'
export { BaseService } from './core/base.service'
export { BaseRepo } from './core/base.repo'

