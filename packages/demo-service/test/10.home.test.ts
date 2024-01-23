import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'

import { testConfig } from '#@/root.config.js'


describe(fileShortPath(import.meta.url), () => {

  const path = '/ping'

  it('Should work', async () => {
    const { httpRequest } = testConfig

    const resp = await httpRequest
      .get(path)
    const ret = resp.text
    assert(ret === 'OK')
  })

})

