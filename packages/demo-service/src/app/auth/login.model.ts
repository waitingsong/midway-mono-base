/**
 * 用户登录输入
 * @method POST
 * @url /auth/login
 */
export interface LoginReq {
  name: string
  /** PBKDF2 HS256 2048 */
  pwd: string
}

/**
 * 用户登录输出
 * @method POST
 * @url /auth/login
 */
export interface LoginResp {
  email: string
  idcard: string
  uid: number
  userName: string
  /** 0未知， 1男，2女 */
  sex: number
  accessToken: string
  updatetoken: string
}
