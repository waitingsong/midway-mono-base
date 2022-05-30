import assert from 'assert/strict'
import { relative } from 'path'

import { testConfig } from '@/root.config'
import { HeapDumpRet, debugPwd } from '~/app/debug/debug.controller'
import { JsonResp } from '~/interface'
import { retrieveIp } from '~/util/common'


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

  // it('Should GET /debug/dump/1/$hash work', async () => {
  //   const { httpRequest } = testConfig
  //   const url = `/debug/dump/1/${debugPwd}`
  //   const resp = await httpRequest
  //     .get(url)
  //     .expect(200)

  //   const { data } = resp.body as JsonResp<HeapDumpRet>
  //   assert(data.pid === process.pid)
  //   assert(data.path.length > 0)
  //   assert(data.path.includes(data.pid.toString()))
  //   assert(data.costSec > 0)

  //   const ip = retrieveIp()
  //   if (ip) {
  //     assert(data.path.includes(ip.address))
  //   }
  // })
})

