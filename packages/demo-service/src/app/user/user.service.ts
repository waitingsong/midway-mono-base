import { Inject, Provide } from '@midwayjs/core'

import { UserRepo } from './user.repo.js'
import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types.js'

import { BaseService } from '##/interface.js'


@Provide()
export class UserService extends BaseService {

  @Inject() readonly repo: UserRepo

  /**
   * 读取用户信息
   */
  async getUser(options: GetUserDTO): Promise<UserDetailDTO> {
    const userName = await this.getUserNameByUid(options.uid)
    const ret: UserDetailDTO = {
      email: 'foo@bar.com',
      uid: options.uid,
      userName,

      userValid: 1,
      sex: 1,
      idcard: '123456789012345678',
      regip: '127.0.0.1',
      lastip: '127.0.0.1',
      json: {},
      ctime: new Date().toUTCString(),
      mtime: new Date().toUTCString(),
    }
    return ret
  }

  async getUserNameByUid(_uid: GetUserDTO['uid']) {
    const name = await this.repo.getUserNameByUid(_uid)
    // const name = 'mockedName'
    return name
  }

}

