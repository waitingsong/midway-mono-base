import type { JsonObject } from '@waiting/shared-types'


/** UC 注册用户基础信息 */
export class TbMemberDO {

  uid: number
  user_name: string
  user_valid: number
  sex: number
  passwd: string
  salt: string
  idcard: string
  email: string
  regip: string
  lastip: string
  json: JsonObject
  ctime: Date
  mtime: Date | null

}

