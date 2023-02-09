import { genDbDict } from 'kmore-types'

import { TbAppDO, TbMemberDO } from '../do/database.do.js'

/**
 * 设定链接库表
 */
export interface DbModel {
  tb_app: TbAppDO
  tb_user: TbMemberDO
}

export const dbDict = genDbDict<DbModel>()

