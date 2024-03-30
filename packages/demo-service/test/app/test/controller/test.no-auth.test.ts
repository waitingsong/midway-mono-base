import assert from 'node:assert/strict'

import { createHttpRequest } from '@midwayjs/mock'
import type { JsonResp } from '@mwcp/boot'
import { fileShortPath } from '@waiting/shared-core'

import { ErrorCode } from '##/types.js'
import { testConfig } from '#@/root.config.js'


describe(fileShortPath(import.meta.url), () => {

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
    // assert(json.code === 2404)
    assert(json.code === ErrorCode.E_Admin_Not_Exists)
    assert(json.msg?.includes('管理员不存在'), resp.text)
  })

})

