import { Provide, Plugin } from '@midwayjs/decorator'
import { Fetch } from '@waiting/egg-fetch'
import { Jwt } from '@waiting/egg-jwt'
import { JsonObject, JsonType } from '@waiting/shared-types'
import type { Koid } from 'egg-koid'

import { BaseService } from '~/interface'


@Provide()
export class HomeService extends BaseService {

  @Plugin() readonly fetch: Fetch

  @Plugin() readonly jwt: Jwt

  @Plugin() readonly koid: Koid

  jwtSign(payload: JsonObject): string {
    const token = this.jwt.sign(payload)
    return token
  }

  jwtVerify(token: string): JsonType {
    const valid = this.jwt.verify(token)
    return valid
  }

  /**
   * 获取网关 IP
   */
  async retrieveGatewayIp(): Promise<string> {
    // const url = 'http://ip.360.cn/IPShare/info'
    const url = 'https://www.taobao.com/help/getip.php'
    const args = this.initFetchArgs
    args.dataType = 'text'
    // ipCallback({ip:"222.233.10.1"})
    const text = await this.fetch.get<string>(url, args).toPromise()
    let ip = ''
    if (text) {
      const arr = /"([\d.]+)"/ui.exec(text)
      ip = arr && arr.length >= 1 && arr[1] ? arr[1] : ''
    }
    this.logger.info({ ip })
    return ip
  }

}

