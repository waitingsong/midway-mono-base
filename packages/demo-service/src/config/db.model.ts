import { Uc } from '@scope/docs'
import { DbModel } from 'egg-kmore'


/**
 * 设定链接库表
 */
export interface UcTbListModel extends DbModel {
  tb_app: Uc.TbApp
  tb_user: Uc.TbMember
}
