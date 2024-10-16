import assert from 'node:assert'

import { Init, Singleton } from '@midwayjs/core'

import { BaseRepo } from '##/interface.js'

import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types.js'


@Singleton()
export class UserRepo extends BaseRepo {

  tb_user: typeof this.db.camelTables.tb_user

  @Init()
  async initTable(): Promise<void> {
    await this.baseInit()
    assert(this.db.dict, 'this.db.dict not exists')
    this.tb_user = this.db.camelTables.tb_user
  }

  async getUserNameByUid(uid: GetUserDTO['uid']): Promise<UserDetailDTO['userName']> {
    // const name = await this.db.camelTables.ref_tb_user()
    const query = this.tb_user()
      .select('userName')
      .where({ uid })

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const sql = query.toString()
    void sql

    const name = await query
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

