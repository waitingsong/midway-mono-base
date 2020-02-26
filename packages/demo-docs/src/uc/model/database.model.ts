import { JsonType } from '@waiting/shared-types'


/** UC 应用列表 */
export interface TbApp {
  app_id: number
  app_name: string
  app_url: string
  app_valid: number
  app_authkey: string
  allow_ips: string[]
  ctime: string | Date
  mtime: string | Date
}

/** UC 注册用户基础信息 */
export interface TbMember {
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
  json: JsonType
  ctime: string | Date
  mtime: string | Date
}

