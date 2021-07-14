import { Provide } from '@midwayjs/decorator'

import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types'

import { BaseRepo } from '~/interface'


@Provide()
export class UserRepo extends BaseRepo {

  async getUserNameByUid(uid: GetUserDTO['uid']): Promise<UserDetailDTO['userName']> {
    const { refTables } = this.db

    const name = await refTables.ref_tb_user()
      .select('user_name')
      .where('uid', uid)
      .then((rows) => {
        if (rows.length === 1) {
          const row = rows[0] as unknown as UserDetailDTO | undefined
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

