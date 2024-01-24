import { ApiProperty } from '@midwayjs/swagger'
import { Rule } from '@midwayjs/validate'

import { TbMemberDO as DO } from '../do/database.do.js'
import { userValidSchemas } from '../validation-schema/index.schema.js'


/**
 * 查询用户请求参数
 */
export class GetUserDTO {
  @ApiProperty({ example: 1, description: 'user id' })
  @Rule(userValidSchemas.uid.required())
  uid: DO['uid']
}


/**
 * 查询用户输出结果
 */
export class UserDetailDTO {
  @ApiProperty({ example: 1, description: 'user id' })
  uid: DO['uid']

  @ApiProperty({ example: 'foo@bar.com' })
  email: DO['email']

  @ApiProperty({ example: 'mark' })
  userName: DO['user_name']

  @ApiProperty({ example: 1, description: '用户是否有效' })
  userValid: DO['user_valid']

  @ApiProperty({ example: 1, description: '用户性别' })
  sex: DO['sex']

  @ApiProperty()
  idcard: DO['idcard']

  @ApiProperty()
  regip: DO['regip']

  @ApiProperty()
  lastip: DO['lastip']

  @ApiProperty()
  json: DO['json']

  @ApiProperty()
  ctime: string

  @ApiProperty()
  mtime: string | null
}

