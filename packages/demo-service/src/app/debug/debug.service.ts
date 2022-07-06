import { constants } from 'node:fs'
import { access, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { Provide } from '@midwayjs/decorator'
import {
  genISO8601String,
  saveHeapSnapshot,
  retrieveFirstIp,
} from '@waiting/shared-core'

import { BaseService } from '~/interface'


@Provide()
export class DebugService extends BaseService {

  async heapdump(): Promise<string> {
    const dir = './run/dump'

    const dd = genISO8601String().replace(/:/ug, '')
    const ip = retrieveFirstIp()
    const ipadd = ip ? ip.address : 'ip'
    // It's important that the filename end with `.heapsnapshot`,
    // otherwise Chrome DevTools won't open it.
    const { pid, ppid } = process
    const fileName = `${ipadd}-${ppid}-${pid}-${dd}.heapsnapshot`

    let path = fileName
    try {
      // eslint-disable-next-line no-bitwise
      await access(dir, constants.R_OK | constants.W_OK)
    }
    catch (ex) {
      await mkdir(dir, { recursive: true })
    }

    await access(dir, constants.W_OK)
    path = join(dir, fileName)

    await saveHeapSnapshot(path)
    return path
  }

}

