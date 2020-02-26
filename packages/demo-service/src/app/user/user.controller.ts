import { Context, controller, get, inject, provide } from 'midway'
import { JsonResp } from '@waiting/shared-types'

import { UserService } from './user.service'
import { UserInfo } from './user.model'


@provide()
@controller('/user')
export class UserController {

  constructor(
    @inject() private userService: UserService,
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

