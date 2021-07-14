import { Provide } from '@midwayjs/decorator'

import { BaseService, JsonObject, JsonType } from '~/interface'


@Provide()
export class TestService extends BaseService {

  jwtSign(payload: JsonObject): string {
    const token = this.jwt.sign(payload)
    return token
  }

  jwtVerify(token: string): JsonType {
    const valid = this.jwt.verify(token)
    return valid
  }

}

