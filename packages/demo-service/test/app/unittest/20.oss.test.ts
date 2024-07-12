import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'

import type { TestRespBody } from '#@/root.config.js'
import { testConfig } from '#@/root.config.js'


describe(fileShortPath(import.meta.url), () => {

  const path = '/unittest/oss_mkdir'

  it.skip('Should work', async () => {
    const { httpRequest } = testConfig

    const resp = await httpRequest
      .get(path)
    const ret = resp.body as TestRespBody

    assert(ret)
    console.log({ ret })

    const { code, data } = ret
    assert(code === 0)

    const { url, header } = data
    assert(url === path, url)
    assert(header)
    assert(header.host && testConfig.host.includes(header.host))
  })

})

