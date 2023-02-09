import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { testConfig } from '@/root.config'
import { HomeService } from '~/app/home/home.service'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should BaseService work', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    // 传入 class 获取实例
    const inst = await ctx.requestContext.getAsync(HomeService)
    assert(inst.idGenerator)

    // 根据依赖注入 Id 获取实例
    const inst2 = await ctx.requestContext.getAsync<HomeService>('homeService')
    assert(inst2.idGenerator)
  })

})

