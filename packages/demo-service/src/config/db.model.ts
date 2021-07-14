import { TbAppDO, TbMemberDO } from '@scope/docs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { genDbDict } from 'kmore-types'


/**
 * 设定链接库表
 */
export interface DbModel {
  tb_app: TbAppDO
  tb_user: TbMemberDO
}

export const dbDict = genDbDict<DbModel>()

