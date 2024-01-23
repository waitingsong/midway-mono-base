import { TbAppDO, TbMemberDO } from '../do/index.do.js'

/**
 * 设定链接库表
 */
export interface DbModel {
  tb_app: TbAppDO
  tb_user: TbMemberDO
}

