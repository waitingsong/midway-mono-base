import { TbMember } from './database.model'


/**
 * 查询用户请求参数
 */
export interface GetUserParam {
  uid: TbMember['uid']
}
/**
 * 查询用户输出DAT字段
 */
export interface GetUserDat {
  email: TbMember['email']
  uid: TbMember['uid']
  userName: TbMember['user_name']
}

