import assert from 'node:assert/strict'

import { createHttpRequest } from '@midwayjs/mock'
import { JwtMsg, schemePrefix } from '@mwcp/jwt'
import { fileShortPath } from '@waiting/shared-core'

import { testConfig } from '#@/root.config.js'


const expectPayloadStr = '{"foo":"bar","iat":1566629919}'
const signature1 = 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'
const header1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
const token1 = header1
  + 'eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.'
  + signature1

describe(fileShortPath(import.meta.url), () => {

  it('should GET /test/sign', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/sign')
      .expect(200)

    const msg: string = resp.text
    assert(msg?.includes('{"foo":"bar",'), msg)
    assert(msg.includes(header1))
  })

  it('should error w/o token', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/token')
      .expect(401)

    const msg: string = resp.text
    assert(msg?.includes(JwtMsg.AuthFailed), msg)
  })

  it('should works with header auth with trailing white space', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/token')
      .set('authorization', `${schemePrefix} ${token1}    `)
      .expect(200)

    const msg: string = resp.text
    assert(msg?.includes(expectPayloadStr), msg)
  })

  it('should works with header auth with trailing tab', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/token')
      .set('authorization', `${schemePrefix} ${token1}  `)
      .expect(200)

    const msg: string = resp.text
    assert(msg?.includes(expectPayloadStr), msg)
  })

  it('should error with header auth with trailing vertical sep', async () => {
    const { app } = testConfig
    try {
      const resp = await createHttpRequest(app)
        .get('/test/token')
        .set('authorization', `${schemePrefix} ${token1}  \v`)
    }
    catch (ex: unknown) {
      assert(ex instanceof Error)
      assert(ex.message.includes('Invalid character in header content'))
      assert(ex.message.includes('["authorization"]'))
      return
    }

    assert(false, 'Should throw error, but not.')
  })

  it('should error with invalid header auth', async () => {
    const { app } = testConfig
    const resp = await createHttpRequest(app)
      .get('/test/token')
      .set('authorization', `${schemePrefix} ${token1}    _`)
      .expect(401)

    const msg: string = resp.text
    assert(msg?.includes(JwtMsg.AuthFailed), msg)
  })

  it('should works with header auth', async () => {
    const { app, jwt } = testConfig
    // npm run test/cov read different config file (local|unittest)
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const resp = await createHttpRequest(app)
      .get('/test/token')
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const msg: string = resp.text
    assert(msg?.includes(expectPayloadStr), msg)
  })

})

