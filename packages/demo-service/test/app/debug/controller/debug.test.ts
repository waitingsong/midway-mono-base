import assert from 'node:assert/strict'
import { relative } from 'node:path'

import type { JsonResp } from '@mw-components/base'

import { testConfig } from '@/root.config'
import { HeapDumpRet, debugPwd } from '~/app/debug/debug.controller'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('Should GET /debug/dump 401', async () => {
    const { httpRequest } = testConfig
    const url = '/debug/dump'
    const resp = await httpRequest
      .get(url)
      .expect(401)
  })

  it('Should GET /debug/dump/ 404', async () => {
    const { httpRequest } = testConfig
    const url = '/debug/dump/'
    const resp = await httpRequest
      .get(url)
      .expect(404)
  })

  it('Should GET /debug/dump/0 404', async () => {
    const { httpRequest } = testConfig
    const url = '/debug/dump/0'
    const resp = await httpRequest
      .get(url)
      .expect(404)
  })

  it('Should GET /debug/dump/0/fake 401', async () => {
    const { httpRequest } = testConfig
    const url = '/debug/dump/0/fake'
    const resp = await httpRequest
      .get(url)
      .expect(401)
  })

  it('Should GET /debug/dump/0/$hash work', async () => {
    const { httpRequest } = testConfig
    const url = `/debug/dump/0/${debugPwd}`
    const resp = await httpRequest
      .get(url)
      .expect(200)

    const { data } = resp.body as JsonResp<HeapDumpRet>
    assert(data.pid === process.pid)
    assert(data.path === '')
    assert(data.costSec === 0)
  })

})

