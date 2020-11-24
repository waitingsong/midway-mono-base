import { JsonResp } from '@waiting/shared-types'
import { Context, controller, get, inject, provide } from 'midway'

import { UserInfo } from './user.model'
import { UserService } from './user.service'


@provide()
@controller('/user')
export class UserController {

  constructor(
    @inject() private readonly userService: UserService,
  ) { }

  @get('/:uid')
  public async getUser(ctx: Context): Promise<void> {
    const uid = +ctx.params.uid
    const user = await this.userService.getUser({ uid })
    const res: JsonResp<UserInfo> = {
      code: 0,
      dat: user,
    }

    ctx.body = res
  }

}

