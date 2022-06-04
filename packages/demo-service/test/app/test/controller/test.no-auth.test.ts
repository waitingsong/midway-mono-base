import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { createHttpRequest } from '@midwayjs/mock'

import { testConfig } from '@/root.config'
import { JsonResp } from '~/interface'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should assert', async () => {
    // const { app, pkg } = testConfig
    // assert(app.config.keys.startsWith(pkg.name))
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

