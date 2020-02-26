import { provide } from 'midway'
// import { DbModel } from 'egg-kmore'

// import { UcTbListModel } from '../../config/db.model'

import { GetUserOpts, UserInfo } from './user.model'


@provide()
export class UserService {

  /*
  constructor(
    @plugin('kmore') private readonly db: DbModel<UcTbListModel>,
  ) { }
  */

  /**
   * 读取用户信息
   */
  public async getUser(options: GetUserOpts): Promise<UserInfo> {
    const ret: UserInfo = {
      email: 'foo@bar.com',
      uid: options.uid,
      userName: 'mockedName',
    }
    return ret
  }


  /* Ensure kmore plugin enabled in config/plugin.ts
  public async getUserName(options: GetUserOpts): Promise<UserInfo['userName']> {
    const { rb } = this.db

    const name = await rb.tb_user()
      .select('user_name')
      .where('uid', options.uid)
      .then(rows => rows[0] ? rows[0].user_name : '')

    return name
  }
  */

}
