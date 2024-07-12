import assert from 'node:assert/strict'

import { createHttpRequest } from '@midwayjs/mock'
import { fileShortPath } from '@waiting/shared-core'

import { testConfig } from '#@/root.config.js'


describe(fileShortPath(import.meta.url), () => {

  it('should assert', async () => {
    // const { app, pkg } = testConfig
    // const ctx = app.mockContext({})
  })

  it('should GET /', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app).get('/')
    assert(resp.ok, resp.text)

    const msg: string = resp.text
    assert(msg?.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /hello', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app).get('/hello')
    assert(resp.ok, resp.text)

    const msg: string = resp.text
    assert(msg?.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /ping', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app).get('/ping')
    assert(resp.ok, resp.text)

    const msg: string = resp.text
    assert(msg && msg === 'OK', msg)
  })

  it('should GET /ip', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app).get('/ip')
    assert(resp.ok, resp.text)

    const ip = resp.text
    assert(ip && /[\d.]+/ui.test(ip))
  })
})

