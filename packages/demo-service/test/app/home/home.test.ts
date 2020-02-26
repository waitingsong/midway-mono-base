import * as assert from 'power-assert'
import { basename, join } from '@waiting/shared-core'
import { app } from 'midway-mock/bootstrap'
import { Jwt, JwtMsg, schemePrefix } from '@waiting/egg-jwt'


const filename = basename(__filename)

const expectPayloadStr = '{"foo":"bar","iat":1566629919}'
const signature1 = 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'
const header1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
const token1 = header1
  + 'eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.'
  + signature1

describe(filename, () => {

  it('should assert', async () => {
    // eslint-disable-next-line
    const pkg = require('../../../package.json')
    assert(app.config.keys.startsWith(pkg.name))
    const ctx = app.mockContext({})
    // await ctx.service.xx();
  })

  it('should GET /', async () => {
    const ret = await app.httpRequest()
      .get('/')
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes('Hello midwayjs!'))
  })

  it('should GET /ping', async () => {
    const ret = await app.httpRequest()
      .get('/ping')
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg === 'OK')
  })

  it('should GET /hello', async () => {
    const ret = await app.httpRequest()
      .get('/hello')
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes('Hello midwayjs!'))
  })

  it('should GET /ip', async () => {
    const ret = await app.httpRequest()
      .get('/ip')
      .expect(200)

    const msg: string = ret.text
    console.log('IP:' + msg)
    assert(msg && msg.includes('ip'))
  })


  it('should GET /test_sign', async () => {
    const ret = await app.httpRequest()
      .get('/test_sign')
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes('{"foo":"bar",'))
    assert(msg.includes(header1))
  })


  it('should error w/o token', async () => {
    const ret = await app.httpRequest()
      .get('/token')
      .expect(401)

    const msg: string = ret.text
    assert(msg && msg.includes(JwtMsg.AuthFailed))
  })

  it('should works with header auth with trailing white space', async () => {
    const ret = await app.httpRequest()
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}    `)
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes(expectPayloadStr))
  })

  it('should works with header auth with trailing tab', async () => {
    const ret = await app.httpRequest()
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}  `)
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes(expectPayloadStr))
  })

  it('should error with header auth with trailing vertical sep', async () => {
    try {
      const ret = await app.httpRequest()
        .get('/token')
        .set('authorization', `${schemePrefix} ${token1}  \v`)
    }
    catch (ex) {
      assert(ex && ex.message.includes('Invalid character in header content'))
      assert(ex && ex.message.includes('["authorization"]'))
    }
  })

  it('should error with invalid header auth', async () => {
    const ret = await app.httpRequest()
      .get('/token')
      .set('authorization', `${schemePrefix} ${token1}    _`)
      .expect(401)

    const msg: string = ret.text
    assert(msg && msg.includes(JwtMsg.AuthFailed))
  })


  it('should works with header auth', async () => {
    // npm run test/cov read different config file (local|unittest)
    const jwt = new Jwt({
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const ret = await app.httpRequest()
      .get('/token')
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg.includes(expectPayloadStr))
  })

  it('should redirect w/o token', async () => {
    // config at src/config/config.local.ts
    const url = '/test_passthrough_redirect'
    const ret = await app.httpRequest()
      .get(url)
      .expect(302)

    const msg: string = ret.text
    assert(msg && msg.includes('Redirecting'))
    assert(msg.includes(`${url}_path`))
  })
})

