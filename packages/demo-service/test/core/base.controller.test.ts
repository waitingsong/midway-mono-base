import { basename, join } from '@waiting/shared-core'

import { testConfig } from '~/../test/test-config'
import { HomeController } from '~/app/home/home.controller'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  it('should Controller ::idGenerator work', async () => {
    const { app } = testConfig
    const inst = await app.createAnonymousContext()
      .requestContext.getAsync(HomeController)

    const id = inst.idGenerator
    const id2 = inst.idGenerator
    const str = id.toString()
    assert(id < id2)
    assert(BigInt(str) === id)
  })

  it('should BaseController work', async () => {
    const { app } = testConfig
    // 传入 class 获取实例
    const inst = await app.createAnonymousContext()
      .requestContext.getAsync(HomeController)

    assert(inst.idGenerator)


    // 根据依赖注入 Id 获取实例
    const inst2 = await app.createAnonymousContext()
      .requestContext.getAsync<HomeController>('homeController')
    assert(inst2.idGenerator)

  })
})

