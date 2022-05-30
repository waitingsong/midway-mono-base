import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@midwayjs/decorator'
import { Validate } from '@midwayjs/validate'

import { UserService } from './user.service'
import { GetUserDTO, UserDetailDTO } from './user.types'

import { BaseController, JsonResp } from '~/interface'


@Controller('/user')
export class UserController extends BaseController {

  @Inject() readonly svc: UserService

  /**
   * @url /user?uid=1
   */
  @Get('/')
  @Validate()
  async getUser(@Query() param: GetUserDTO): Promise<UserDetailDTO> {
    const user = await this.svc.getUser(param)
    return user
  }

  /**
   *
   * @url /user/1
   * @description 不推荐单个参数获取，因为无法校验并自动格式化输入参数！
   */
  @Get('/:id')
  @Validate()
  async getUser2(@Param('id') id: GetUserDTO['uid']): Promise<JsonResp<UserDetailDTO>> {
    const uid = +id
    if (Number.isNaN(uid) || uid <= 0) {
      this.throwError('uid必须自然数')
    }
    const user = await this.svc.getUser({ uid })
    const res = {
      code: 0,
      data: user,
    }

    return res
  }

}

