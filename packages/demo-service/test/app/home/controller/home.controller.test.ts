import { basename, join } from '@waiting/shared-core'

import { testConfig } from '~/../test/test-config'
import { HomeController } from '~/app/home/home.controller'


// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  it('should Controller home::idGenerator works', async () => {
    const { app } = testConfig
    const inst = await app.createAnonymousContext()
      .requestContext.getAsync(HomeController)

    const id = inst.idGenerator
    const id2 = inst.idGenerator
    const str = id.toString()
    assert(id < id2)
    assert(BigInt(str) === id)
  })

})

async function next(): Promise<void> {
  return void 0
}
