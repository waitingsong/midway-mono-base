import { RuleType } from '@midwayjs/validate'
import { commonValidSchemas } from '@mwcp/share'


export const userValidSchemas = {
  /** 用户id */
  uid: commonValidSchemas.id,

  /** 用户名 */
  uname: commonValidSchemas.string.min(3).max(50),

  /** 登录明文口令，用于（前端）验证用户输入 */
  password: commonValidSchemas.string.min(4).max(50),

  /** 登录密文口令(hashed)，用于验证提交值 */
  hashpwd: commonValidSchemas.string.min(40).max(255),

  /** 邮件地址 */
  email: RuleType.string().trim().email(),
}

