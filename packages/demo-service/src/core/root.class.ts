import { Inject } from '@midwayjs/decorator'
import { RootClass as Root } from '@mw-components/base'
import { ClientService } from '@mw-components/taskman'

import { JwtUser } from '../types'


export class RootClass extends Root {

  @Inject() readonly taskMan: ClientService

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>()
  }

}


