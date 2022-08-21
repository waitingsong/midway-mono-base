import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { createHttpRequest } from '@midwayjs/mock'
import type { JsonResp } from '@mw-components/base'
import { JwtMsg, schemePrefix } from '@mw-components/jwt'

import { testConfig } from '@/root.config'
import { UserDetailDTO } from '~/app/user/user.types'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should GET /user error w/o token', async () => {
    const { app } = testConfig
    const url = '/user/1'
    const resp = await createHttpRequest(app)
      .get(url)
      .expect(401)

    const msg: string = resp.text
    assert(msg && msg.includes(JwtMsg.AuthFailed), msg)
  })


  it('should GET /user?uid=1 works with header auth', async () => {
    const { app, jwt } = testConfig
    const url = '/user?uid=1'
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const body = resp.body as JsonResp<UserDetailDTO>
    assert(body)

    const { data } = body
    assert(data)
    assert(data.uid === 1)
    assert(data.userName === 'mockedName')
    assert(data.email === 'foo@bar.com')
  })

  it('should GET /user/1 works with header auth', async () => {
    const { app, jwt } = testConfig
    const url = '/user/1'
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const body = resp.body as JsonResp<UserDetailDTO>
    assert(body)

    const { data } = body
    assert(data)
    assert(data.uid === 1)
    assert(data.userName === 'mockedName')
    assert(data.email === 'foo@bar.com')
  })

  it('should GET /user/0 works with header auth', async () => {
    const { app, jwt } = testConfig
    const url = '/user/0'
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(500)

    const body = resp.body as JsonResp
    assert(body)

    const { msg } = body
    assert(msg && msg.includes('uid必须自然数'))
  })

})

