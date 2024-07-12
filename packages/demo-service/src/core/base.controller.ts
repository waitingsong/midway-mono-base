import { RootController } from '@mwcp/boot'

import type { JwtUser } from '##/types.js'


export class BaseController extends RootController {

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>(this.ctx)
  }
}

