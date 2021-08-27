import { NetworkInterfaceInfo, networkInterfaces } from 'os'

import {
  Context,
  MiddlewarePathPattern,
} from '~/interface'


/**
 * 获取网络信息，不包括回环地址信息
 */
export function retrieveExternalNetWorkInfo(): NetworkInterfaceInfo[] {
  const ret = Object.entries(networkInterfaces()).reduce((acc: NetworkInterfaceInfo[], curr) => {
    const [, nets] = curr
    /* istanbul ignore if */
    if (! nets) {
      return acc
    }
    nets.forEach((net) => {
    // Skip over internal (i.e. 127.0.0.1) addresses
      if (! net.internal) {
        acc.push(net)
      }
    })
    return acc
  }, [])

  return ret
}

export async function sleep(timeout = 1000): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export function reqestPathMatched(
  ctx: Context,
  rules?: MiddlewarePathPattern,
): boolean {

  if (! rules) {
    return false
  }

  const { path } = ctx

  const ret = rules.some((rule) => {
    if (! rule) {
      return
    }
    else if (typeof rule === 'string') {
      return rule === path
    }
    else if (rule instanceof RegExp) {
      return rule.test(path)
    }
    else if (typeof rule === 'function') {
      return rule(ctx)
    }
    else {
      throw new TypeError('Invalid type of rule value')
    }
  })
  return ret
}


