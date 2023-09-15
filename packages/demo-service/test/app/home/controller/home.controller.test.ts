import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'

import { HomeController } from '##/app/home/home.controller.js'
import { testConfig } from '#@/root.config.js'


describe(fileShortPath(import.meta.url), () => {

  it('should Controller home::idGenerator works', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const inst = await ctx.requestContext.getAsync(HomeController)

    const id = inst.idGenerator
    const id2 = inst.idGenerator
    const str = id.toString()
    assert(id < id2)
    assert(BigInt(str) === id)
  })

})

