import { Rule } from '@midwayjs/decorator'

import { TbMemberDO } from '../do/database.do'
import { userValidSchemas } from '../validation-schema/index.schema'



/**
 * 查询用户请求参数
 */
export class GetUserDTO {

  @Rule(userValidSchemas.uid.required())
  uid: TbMemberDO['uid']

}

/**
 * 查询用户输出结果
 */
export class UserDetailDTO {

  @Rule(userValidSchemas.email.required())
  email: TbMemberDO['email']

  @Rule(userValidSchemas.uid.required())
  uid: TbMemberDO['uid']

  @Rule(userValidSchemas.uname.required())
  userName: TbMemberDO['user_name']

}

