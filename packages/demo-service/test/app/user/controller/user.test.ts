import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { Jwt, JwtMsg, schemePrefix } from '@waiting/egg-jwt'
import { basename, join } from '@waiting/shared-core'
import { Application } from 'egg'

import { UserDetailDTO } from '~/app/user/user.types'
import { JsonResp } from '~/interface'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })


  it('should GET /user error w/o token', async () => {
    const url = '/user/1'
    const resp = await createHttpRequest(app)
      .get(url)
      .expect(401)

    const msg: string = resp.text
    assert(msg && msg.includes(JwtMsg.AuthFailed), msg)
  })


  it('should GET /user?uid=1 works with header auth', async () => {
    const url = '/user?uid=1'
    const jwt = new Jwt({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const body = resp.body as JsonResp<UserDetailDTO>
    assert(body)

    const { dat } = body
    assert(dat)
    assert(dat.uid === 1)
    assert(dat.userName === 'mockedName')
    assert(dat.email === 'foo@bar.com')
  })

  it('should GET /user/1 works with header auth', async () => {
    const url = '/user/1'
    const jwt = new Jwt({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const body = resp.body as JsonResp<UserDetailDTO>
    assert(body)

    const { dat } = body
    assert(dat)
    assert(dat.uid === 1)
    assert(dat.userName === 'mockedName')
    assert(dat.email === 'foo@bar.com')
  })

  it('should GET /user/0 works with header auth', async () => {
    const url = '/user/0'
    const jwt = new Jwt({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(500)

    const body = resp.body as JsonResp
    assert(body)

    const { msg } = body
    assert(msg?.includes('uid必须自然数'))
  })

})

