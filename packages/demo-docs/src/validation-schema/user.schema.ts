import { RuleType } from '@midwayjs/decorator'


export const userValidSchemas = {
  /** 用户id */
  uid: RuleType.number().min(1).max(Number.MAX_SAFE_INTEGER),

  /** 用户名 */
  uname: RuleType.string().trim().min(3).max(50),

  /** 登录明文口令，用于（前端）验证用户输入 */
  password: RuleType.string().trim().min(4).max(50),

  /** 登录密文口令(hashed)，用于验证提交值 */
  hashpwd: RuleType.string().trim().min(40).max(255),

  /** 邮件地址 */
  email: RuleType.string().trim().email(),
}

