import { basename, join } from '@waiting/shared-core'

import { testConfig } from '~/../test/test-config'
import { HomeService } from '~/app/home/home.service'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  it('should BaseService work', async () => {
    const { app } = testConfig
    // 传入 class 获取实例
    const inst = await app.createAnonymousContext()
      .requestContext.getAsync(HomeService)
    assert(inst.idGenerator)


    // 根据依赖注入 Id 获取实例
    const inst2 = await app.createAnonymousContext()
      .requestContext.getAsync<HomeService>('homeService')
    assert(inst2.idGenerator)
  })

})

