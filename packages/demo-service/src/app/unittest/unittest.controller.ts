import {
  Controller,
  Get,
} from '@midwayjs/decorator'

import { TestRespBody } from './types'

import { BaseController } from '~/interface'


@Controller('/unittest')
export class UnittestController extends BaseController {

  @Get('/home')
  async home(): Promise<TestRespBody> {
    const { header, url } = this.ctx
    const res = {
      header,
      url,
    }
    return res
  }

}

