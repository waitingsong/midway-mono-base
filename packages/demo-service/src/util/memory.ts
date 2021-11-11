import fs from 'fs'
import v8 from 'v8'

import { join, genISO8601String } from '@waiting/shared-core'

import { retrieveIp } from './common'


export function createHeapSnapshot(dir = ''): string {
  const dd = genISO8601String().replace(/:/ug, '')
  const ip = retrieveIp()
  const ipadd = ip ? ip.address : 'ip'
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const { pid, ppid } = process
  const fileName = `${ipadd}-${ppid}-${pid}-${dd}.heapsnapshot`
  let path = fileName
  if (dir) {
    try {
      // eslint-disable-next-line no-bitwise
      fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK)
    }
    catch (ex) {
      fs.mkdirSync(dir)
    }

    fs.accessSync(dir, fs.constants.W_OK)
    path = join(dir, fileName)
  }
  const snapshotStream = v8.getHeapSnapshot()
  const fileStream = fs.createWriteStream(path)
  snapshotStream.pipe(fileStream)

  // await fs.promises.writeFile(
  //   `${Date.now()}.heapsnapshot`,
  //   v8.getHeapSnapshot()
  // );

  return path
}

