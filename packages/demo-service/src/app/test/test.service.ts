import { Provide } from '@midwayjs/decorator'

import { BaseService, JsonObject, JwtResult } from '~/interface'


@Provide()
export class TestService extends BaseService {

  jwtSign(payload: JsonObject): string {
    const token = this.jwt.sign(payload)
    return token
  }

  jwtVerify(token: string): JwtResult {
    const valid = this.jwt.verify(token)
    return valid
  }

}

