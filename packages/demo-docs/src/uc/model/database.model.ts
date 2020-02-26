import { JsonType } from '@waiting/shared-types'


/** UC 应用列表 */
export interface TbApp {
  appId: number
  appName: string
  appUrl: string
  appValid: number
  appSecret: string
  allowIps: string[]
  ctime: string | Date
  mtime: string | Date
}

/** UC 注册用户基础信息 */
export interface TbMember {
  uid: number
  userName: string
  userValid: number
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

