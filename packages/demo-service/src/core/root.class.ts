import { Inject } from '@midwayjs/core'
import { RootClass as Root } from '@mwcp/boot'
import { ClientService } from '@mwcp/taskman'

import { ErrorCode, JwtUser } from '../types'


export class RootClass extends Root {

  @Inject() readonly taskMan: ClientService

  declare globalErrorCode: typeof ErrorCode

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>()
  }

}


