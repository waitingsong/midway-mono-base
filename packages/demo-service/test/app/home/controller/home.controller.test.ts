import { relative } from 'path'

import { testConfig } from '../../../root.config'

import { HomeController } from '~/app/home/home.controller'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

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

