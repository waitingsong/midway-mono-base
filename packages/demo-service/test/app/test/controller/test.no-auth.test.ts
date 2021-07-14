import { createHttpRequest } from '@midwayjs/mock'
import { basename, join } from '@waiting/shared-core'
import { NpmPkg } from '@waiting/shared-types'

import { testConfig } from '~/../test/test-config'
import { JsonResp } from '~/interface'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

// eslint-disable-next-line
const pkg: NpmPkg = require('../../../../package.json')

describe(filename, () => {

  it('should assert', async () => {
    const { app } = testConfig
    assert(app.config.keys.startsWith(pkg.name))
    // const ctx = app.mockContext({})
  })


  it('should GET /test/err ', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/err')
      .expect(200)

    const json = resp.body as JsonResp
    assert(json.code === 2404)
    assert(json.msg && json.msg.includes('管理员不存在'), resp.text)
  })

})

