// Ensure kmore plugin enabled in config/plugin.ts
import {
  Plugin,
  Provide,
} from '@midwayjs/decorator'
import { Kmore } from 'egg-kmore'

import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types'

import { UcModel } from '~/config/db.model'
import { BaseRepo } from '~/interface'


@Provide()
export class UserRepo extends BaseRepo {

  @Plugin('kmore') protected readonly db: Kmore<UcModel>

  async getUserNameByUid(uid: GetUserDTO['uid']): Promise<UserDetailDTO['userName']> {
    const { rb } = this.db
    const name = await rb.tb_user()
      .select('user_name')
      .where('uid', uid)
      .then((rows) => {
        /* istanbul ignore next */
        if (rows.length > 1) {
          this.throwError(`用户uid存在重复记录 uid: ${uid}`)
        }
        return rows[0] ? rows[0].user_name : ''
      })

    return name
  }

}

