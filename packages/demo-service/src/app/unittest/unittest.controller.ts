import assert from 'node:assert'

import {
  Controller,
  Get,
} from '@midwayjs/decorator'

import { TestRespBody } from './types'

import { OssClientKey } from '~/config/config.types'
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

  @Get('/oss_mkdir')
  async uploadOss(): Promise<TestRespBody> {
    const ossClient = this.aliOssMan.getDataSource(OssClientKey.ossmain)

    const cloudUrlPrefix = 'mobileFile/debug' + Math.random().toString()

    const mkdirRet = await ossClient.mkdir(cloudUrlPrefix)
    assert(! mkdirRet.exitCode, 'mkdir failed')
    assert(mkdirRet.data, 'mkdir failed')

    const rmrfRet = await ossClient.rmrf(cloudUrlPrefix)
    assert(! rmrfRet.exitCode, 'rmrf failed')

    const { header, url } = this.ctx
    const res = {
      header,
      url,
    }
    return res
  }

}

