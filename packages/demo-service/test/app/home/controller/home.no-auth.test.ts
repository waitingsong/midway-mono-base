/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename, join } from '@waiting/shared-core'
import { NpmPkg } from '@waiting/shared-types'
import { Application } from 'egg'

import { JsonResp } from '~/interface'


const assert = require('power-assert')


const filename = basename(__filename)

// eslint-disable-next-line
const pkg: NpmPkg = require('../../../../package.json')

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  it('should assert', async () => {
    assert(app.config.keys.startsWith(pkg.name))
    // const ctx = app.mockContext({})
  })

  it('should GET /', async () => {
    const resp = await createHttpRequest(app)
      .get('/')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /hello', async () => {
    const resp = await createHttpRequest(app)
      .get('/hello')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes('Hello Midwayjs!'), msg)
  })

  it('should GET /test_err ', async () => {
    const resp = await createHttpRequest(app)
      .get('/test_err')
      .expect(200)

    const json = resp.body as JsonResp
    assert(json.code === 2404)
    assert(json.msg && json.msg.includes('管理员不存在'), resp.text)
  })

  it('should GET /ping', async () => {
    const resp = await createHttpRequest(app)
      .get('/ping')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg === 'OK', msg)
  })

  it('should GET /ip', async () => {
    const resp = await createHttpRequest(app)
      .get('/ip')
      .expect(200)

    const ip = resp.text
    assert(ip && /[\d.]+/ui.test(ip))
  })
})

