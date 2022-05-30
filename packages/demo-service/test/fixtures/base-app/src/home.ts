import {
  Config as _Config,
  Controller,
  Get,
} from '@midwayjs/decorator'

import { TestRespBody } from '@/root.config'
import { Context } from '~/interface'


@Controller('/')
export class HomeController {

  @Get('/')
  async home(ctx: Context): Promise<TestRespBody> {
    const { cookies, header, url } = ctx
    const res = {
      cookies,
      header,
      url,
    }
    return res
  }

}

