import { Inject } from '@midwayjs/decorator'
import { RootClass as Root } from '@mw-components/base'
import { ClientService } from '@mw-components/taskman'

import { ErrorCode, JwtUser } from '../types'


export class RootClass extends Root {

  @Inject() readonly taskMan: ClientService

  declare globalErrorCode: typeof ErrorCode

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>()
  }

}


