import {
  ALL,
  Controller,
  Get,
  Inject,
  Param,
  Plugin,
  Provide,
  Query,
  Validate,
} from '@midwayjs/decorator'
import type { Koid } from 'egg-koid'

import { UserService } from './user.service'
import { GetUserDTO, UserDetailDTO } from './user.types'

import { BaseController, JsonResp } from '~/interface'


@Provide()
@Controller('/user')
export class UserController extends BaseController {

  @Plugin() readonly koid: Koid

  @Inject() readonly userService: UserService

  /**
   * @url /user?uid=1
   */
  @Get('/')
  @Validate()
  async getUser(@Query(ALL) param: GetUserDTO): Promise<UserDetailDTO> {
    const user = await this.userService.getUser(param)
    return user
  }

  /**
   *
   * @url /user/1
   * @description 不推荐单个参数获取，因为无法校验并自动格式化输入参数！
   */
  @Get('/:id')
  @Validate()
  async getUser2(@Param() id: GetUserDTO['uid']): Promise<JsonResp<UserDetailDTO>> {
    const uid = +id
    if (Number.isNaN(uid) || uid <= 0) {
      this.throwError('uid必须自然数')
    }
    const user = await this.userService.getUser({ uid })
    const res = {
      code: 0,
      dat: user,
    }

    return res
  }

}

