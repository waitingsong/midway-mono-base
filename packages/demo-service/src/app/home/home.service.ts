import { Provide } from '@midwayjs/core'
import { AppInfomation } from '@mwcp/boot'
import { retrieveFirstIp } from '@waiting/shared-core'

import { BaseService } from '~/interface'


@Provide()
export class HomeService extends BaseService {

  appInfo(): AppInfomation {
    const { reqId } = this.ctx
    const ip = retrieveFirstIp()
    const ret: AppInfomation = {
      pkgName: this.pkg.name,
      pkgVer: this.pkg.version ?? 'n/a',
      pid: process.pid,
      ppid: process.ppid,
      ip: ip ? ip.address : 'n/a',
      reqId,
    }

    return ret
  }


  /**
   * 获取网关 IP
   */
  async retrieveGatewayIp(): Promise<string> {
    // const url = 'http://ip.360.cn/IPShare/info'
    const url = 'https://www.taobao.com/help/getip.php'
    // ipCallback({ip:"222.233.10.1"})
    const text = await this.getText(url)
    let ip = ''
    if (text) {
      const arr = /"([\d.]+)"/ui.exec(text)
      ip = arr && arr.length >= 1 && arr[1] ? arr[1] : ''
    }
    this.logger.info({ ip })
    return ip
  }

}

