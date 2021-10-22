import {
  Config,
  Provide,
} from '@midwayjs/decorator'

import {
  AppInfomation,
  BaseService,
  NpmPkg,
} from '~/interface'
import { retrieveIp } from '~/util/common'


@Provide()
export class HomeService extends BaseService {

  @Config() readonly pkgJson: NpmPkg

  appInfo(): AppInfomation {
    const { reqId } = this.ctx
    const ip = retrieveIp()
    const ret: AppInfomation = {
      pkgName: this.pkgJson.name,
      pkgVer: this.pkgJson.version ?? 'n/a',
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

