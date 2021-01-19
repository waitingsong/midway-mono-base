import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { Jwt, JwtMsg, schemePrefix } from '@waiting/egg-jwt'
import { basename, join } from '@waiting/shared-core'
import { Application } from 'egg'
import assert = require('power-assert')


const filename = basename(__filename)

const expectPayloadStr = '{"foo":"bar","iat":1566629919}'
const signature1 = 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'
const header1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
const token1 = header1
  + 'eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.'
  + signature1

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  it('should GET /test_sign', async () => {
    const resp = await createHttpRequest(app)
      .get('/test_sign')
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes('{"foo":"bar",'), msg)
    assert(msg.includes(header1))
  })

  it('should error w/o token', async () => {
    const resp = await createHttpRequest(app)
      .get('/token')
      .expect(401)

    const msg: string = resp.text
    assert(msg && msg.includes(JwtMsg.AuthFailed), msg)
  })

  it('should works with header auth with trailing white space', async () => {
    const resp = await createHttpRequest(app)
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}    `)
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes(expectPayloadStr), msg)
  })

  it('should works with header auth with trailing tab', async () => {
    const resp = await createHttpRequest(app)
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}  `)
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes(expectPayloadStr), msg)
  })

  it('should error with header auth with trailing vertical sep', async () => {
    try {
      const resp = await createHttpRequest(app)
        .get('/token')
        .set('authorization', `${schemePrefix} ${token1}  \v`)
    }
    catch (ex) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      assert(ex && ex.message.includes('Invalid character in header content'))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      assert(ex && ex.message.includes('["authorization"]'))
      return
    }

    assert(false, 'Should throw error, but not.')
  })

  it('should error with invalid header auth', async () => {
    const resp = await createHttpRequest(app)
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}    _`)
      .expect(401)

    const msg: string = resp.text
    assert(msg && msg.includes(JwtMsg.AuthFailed), msg)
  })

  it('should works with header auth', async () => {
    // npm run test/cov read different config file (local|unittest)
    const jwt = new Jwt({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get('/token')
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const msg: string = resp.text
    assert(msg && msg.includes(expectPayloadStr), msg)
  })


  it('should redirect w/o token', async () => {
    // config at src/config/config.local.ts
    const url = '/test_passthrough_redirect'
    const resp = await createHttpRequest(app)
      .get(url)
      .expect(302)

    const msg: string = resp.text
    assert(msg && msg.includes('Redirecting'))
    assert(msg.includes(`${url}_path`))
  })

})

