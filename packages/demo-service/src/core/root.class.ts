import { RootClass as Root } from '@mwcp/boot'
// import { ClientService } from '@mwcp/taskman'

import { JwtUser } from '../types.js'


export class RootClass extends Root {

  // @Inject() readonly taskMan: ClientService

  get jwtPayload(): JwtUser {
    return this.getJwtPayload<JwtUser>()
  }

}


