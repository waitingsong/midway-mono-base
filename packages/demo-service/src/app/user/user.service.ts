import { Inject, Provide } from '@midwayjs/decorator'

import { UserRepo } from './user.repo'
import {
  GetUserDTO,
  UserDetailDTO,
} from './user.types'

import { BaseService } from '~/interface'


@Provide()
export class UserService extends BaseService {

  @Inject() readonly userRepo: UserRepo

  /**
   * 读取用户信息
   */
  async getUser(options: GetUserDTO): Promise<UserDetailDTO> {
    const userName = await this.getUserNameByUid(options.uid)
    const ret: UserDetailDTO = {
      email: 'foo@bar.com',
      uid: options.uid,
      userName,
    }
    return ret
  }

  async getUserNameByUid(_uid: GetUserDTO['uid']): Promise<UserDetailDTO['userName']> {
    // const name = await this.userRepo.getUserNameByUid(_uid)
    const name = 'mockedName'
    return name
  }

}

