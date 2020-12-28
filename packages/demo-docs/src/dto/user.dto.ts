import { Rule } from '@midwayjs/decorator'

import { TbMemberDo } from '../do/database.do'
import { userValidSchemas } from '../validation-schema/index.schema'



/**
 * 查询用户请求参数
 */
export class GetUserDTO {

  @Rule(userValidSchemas.uid.required())
  uid: TbMemberDo['uid']

}

/**
 * 查询用户输出结果
 */
export class UserDetailDTO {

  @Rule(userValidSchemas.email.required())
  email: TbMemberDo['email']

  @Rule(userValidSchemas.uid.required())
  uid: TbMemberDo['uid']

  @Rule(userValidSchemas.uname.required())
  userName: TbMemberDo['user_name']

}

