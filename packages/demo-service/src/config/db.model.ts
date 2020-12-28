import { TbAppDo, TbMemberDo } from '@scope/docs'
import { DbModel } from 'egg-kmore'


/**
 * 设定链接库表
 */
export interface UcModel extends DbModel {
  tb_app: TbAppDo
  tb_user: TbMemberDo
}

