import { Rule } from '@midwayjs/validate'

import { userValidSchemas } from '../validation-schema/index.schema'


export class LoginDTO {
  @Rule(userValidSchemas.uname.required())
  username: string

  @Rule(userValidSchemas.hashpwd.required())
  hashpwd: string
}

