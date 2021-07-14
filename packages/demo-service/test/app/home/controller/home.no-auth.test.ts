import { createHttpRequest } from '@midwayjs/mock'
import { basename, join } from '@waiting/shared-core'
import { NpmPkg } from '@waiting/shared-types'

import { testConfig } from '~/../test/test-config'

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

  it('should GET /', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /hello', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/hello')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /ping', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/ping')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg === 'OK', msg)
  })

  it('should GET /ip', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/ip')
      .expect(200)

    const ip = resp.text
    assert(ip && /[\d.]+/ui.test(ip))
  })
})

