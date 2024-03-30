import { ApiProperty } from '@midwayjs/swagger'
import { Rule } from '@midwayjs/validate'

import { userValidSchemas } from '../validation-schema/index.schema.js'


export class LoginDTO {

  @ApiProperty({ example: 'foo', description: '' })
  @Rule(userValidSchemas.uname.required())
  username: string

  @ApiProperty({ example: 'fsd98fsdgsgh', description: '' })
  @Rule(userValidSchemas.hashpwd.required())
  hashpwd: string

}

