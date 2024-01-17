import { Rule } from '@midwayjs/validate'
import type { RecordCamelKeys } from '@waiting/shared-types'

import { TbMemberDO as DO } from '../do/database.do.js'
import { userValidSchemas } from '../validation-schema/index.schema.js'


/**
 * 查询用户请求参数
 */
export class GetUserDTO implements Pick<RecordCamelKeys<DO>, 'uid'> {
  @Rule(userValidSchemas.uid.required())
  uid: DO['uid']
}


/**
 * 查询用户输出结果
 */
export class UserDetailDTO implements Omit<RecordCamelKeys<DO>, 'passwd' | 'salt'> {

  @Rule(userValidSchemas.email.required())
  email: DO['email']

  @Rule(userValidSchemas.uid.required())
  uid: DO['uid']

  @Rule(userValidSchemas.uname.required())
  userName: DO['user_name']

  userValid: DO['user_valid']
  sex: DO['sex']
  idcard: DO['idcard']
  regip: DO['regip']
  lastip: DO['lastip']
  json: DO['json']
  ctime: DO['ctime']
  mtime: DO['mtime']
}

