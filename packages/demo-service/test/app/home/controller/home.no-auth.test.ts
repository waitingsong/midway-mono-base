import { relative } from 'path'

import { createHttpRequest } from '@midwayjs/mock'

import { testConfig } from '../../../root.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('should assert', async () => {
    const { app, pkg } = testConfig
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

