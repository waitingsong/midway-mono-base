import type { JwtState } from '@mwcp/jwt'

import type { JwtUser } from './types.js'


declare module '@midwayjs/koa/dist/interface.js' {
  interface Context {
    // @ts-ignore
    jwtState: JwtState<JwtUser>
  }
}


export { BaseController } from './core/base.controller.js'
export { BaseService } from './core/base.service.js'
export { BaseRepo } from './core/base.repo.js'

