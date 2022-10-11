import { Inject } from '@midwayjs/decorator'
import { RootClass as Root } from '@mwcp/base'
import { ClientService } from '@mwcp/taskman'

import { ErrorCode, JwtUser } from '../types'


export class RootClass extends Root {

  @Inject() readonly taskMan: ClientService

  declare globalErrorCode: typeof ErrorCode

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>()
  }

}


