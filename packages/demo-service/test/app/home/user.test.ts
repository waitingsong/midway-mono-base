import * as assert from 'power-assert'
import { basename, join } from '@waiting/shared-core'
import { JsonResp } from '@waiting/shared-types'
import { app } from 'midway-mock/bootstrap'
import { Jwt, JwtMsg, schemePrefix } from '@waiting/egg-jwt'

import { UserInfo } from '../../../src/app/user/user.model'


const filename = basename(__filename)

describe(filename, () => {
  const url = '/user/1'

  it('should GET /user error w/o token', async () => {
    const ret = await app.httpRequest()
      .get(url)
      .expect(401)

    const msg: string = ret.text
    assert(msg && msg.includes(JwtMsg.AuthFailed))
  })

  it('should GET /user works with header auth', async () => {
    const jwt = new Jwt({
      secret: app.config.jwt.client.secret,
    })
    const token2 = jwt.sign({ foo: 'bar', iat: 1566629919 })
    const ret = await app.httpRequest()
      .get(url)
      .set('authorization', `${schemePrefix} ${token2}`)
      .expect(200)

    const res: JsonResp<UserInfo> = ret.body
    const { dat } = res
    assert(res && dat)
    assert(dat
      && dat.uid === 1
      && dat.userName === 'mockedName'
      && dat.email === 'foo@bar.com')
  })

})

