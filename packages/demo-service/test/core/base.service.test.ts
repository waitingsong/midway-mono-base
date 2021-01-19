import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename, join } from '@waiting/shared-core'
import { Application } from 'egg'

import { HomeService } from '~/app/home/home.service'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })


  it('should BaseService works', async () => {
    // 传入 class 获取实例
    const inst = await app.createAnonymousContext()
      .requestContext.getAsync(HomeService)
    const args = inst.initFetchArgs
    assert(args.dataType === 'json')

    // 根据依赖注入 Id 获取实例
    const inst2 = await app.createAnonymousContext()
      .requestContext.getAsync<HomeService>('homeService')
    const args2 = inst2.initFetchArgs
    assert(args2.dataType === 'json')
  })

})

