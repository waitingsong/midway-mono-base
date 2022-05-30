
export {
  ErrorCode,
  GetUserDTO,
  UserDetailDTO,
  TbAppDO,
  TbMemberDO,
} from '@scope/docs'

export interface JwtUser {
  uid: string
}


export interface AppInfomation {
  pkgName: string
  pkgVer: string
  pid: number
  ppid: number
  ip: string
  reqId: string
  [key: string]: string | number
}

