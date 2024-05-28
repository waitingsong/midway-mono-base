import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@midwayjs/core'
import { ApiResponse } from '@midwayjs/swagger'
import { Validate } from '@midwayjs/validate'

import { BaseController } from '##/interface.js'

import { UserService } from './user.service.js'
import { GetUserDTO, UserDetailDTO } from './user.types.js'



@Controller('/user')
export class UserController extends BaseController {

  @Inject() readonly svc: UserService

  /**
   * @url /user?uid=1
   */
  @Get('/')
  @Validate()
  @ApiResponse({ type: UserDetailDTO })
  async getUser(@Query() param: GetUserDTO) {
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
  @ApiResponse({ type: UserDetailDTO })
  async getUser2(@Param('id') id: GetUserDTO['uid']) {
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

