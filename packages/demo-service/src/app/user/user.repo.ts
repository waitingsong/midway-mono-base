import { Init, Provide } from '@midwayjs/core'

import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types'

import { BaseRepo } from '~/interface'


@Provide()
export class UserRepo extends BaseRepo {

  ref_tb_user: typeof this.db.camelTables.ref_tb_user

  @Init()
  async initTable(): Promise<void> {
    await this.baseInit()
    this.ref_tb_user = this.db.camelTables.ref_tb_user
  }

  async getUserNameByUid(uid: GetUserDTO['uid']): Promise<UserDetailDTO['userName']> {
    // const name = await this.db.camelTables.ref_tb_user()
    const name = await this.ref_tb_user()
      .select('userName')
      .where({ uid })
      .then((rows) => {
        if (rows.length === 1) {
          const [row] = rows
          return row ? row.userName : ''
        }
        else if (rows.length > 1) {
          this.throwError(`用户uid存在重复记录 uid: ${uid}`)
        }
        else {
          this.throwError(`用户uid记录异常 uid: ${uid}`)
        }
      })

    return name
  }

}

