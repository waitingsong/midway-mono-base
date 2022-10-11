import assert from 'node:assert/strict'
import { relative } from 'node:path'

import type { JsonResp } from '@mwcp/base'

import { testConfig, TestRespBody } from '@/root.config'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  const path = '/unittest/home'

  it('Should work', async () => {
    const { httpRequest } = testConfig

    const resp = await httpRequest
      .get(path)
    const ret = resp.body as JsonResp<TestRespBody>

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

