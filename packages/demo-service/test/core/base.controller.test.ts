import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { testConfig } from '@/root.config'
import { HomeController } from '~/app/home/home.controller'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should Controller ::idGenerator work', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const inst = await ctx.requestContext.getAsync(HomeController)

    const id = inst.idGenerator
    const id2 = inst.idGenerator
    const str = id.toString()
    assert(id < id2)
    assert(BigInt(str) === id)
  })

  it('should BaseController work', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    // 传入 class 获取实例
    const inst = await ctx.requestContext.getAsync(HomeController)
    assert(inst.idGenerator)
  })
})

