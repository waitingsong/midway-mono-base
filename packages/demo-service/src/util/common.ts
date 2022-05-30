import { NetworkInterfaceInfo, networkInterfaces } from 'os'

import { isPathMatchRules } from '@waiting/shared-core'
import { MiddlewareConfig } from '@waiting/shared-types'

import { Context } from '~/interface'


/**
 * Return true if rules of match and ignore empty
 */
export function matchFunc(
  ctx?: Context,
  mwConfig?: MiddlewareConfig,
): boolean {

  if (! ctx) {
    return false
  }
  if (! mwConfig) {
    return false
  }

  const { enableMiddleware, match, ignore } = mwConfig

  if (! enableMiddleware) {
    return false
  }

  if (Array.isArray(ignore) && ignore.length) {
    const matched = isPathMatchRules(ctx.path, ignore)
    return ! matched
  }
  else if (Array.isArray(match) && match.length) {
    const matched = isPathMatchRules(ctx.path, ignore)
    return matched
  }
  else {
    return true
  }
}


/**
 *
 * 获取第一个网络信息，不包括回环地址信息
 */
export function retrieveIp(family: NetworkInterfaceInfo['family'] = 'IPv4'): NetworkInterfaceInfo | undefined {
  const ips = retrieveExternalNetWorkInfo()
  for (const info of ips) {
    if (info.family === family) {
      return info
    }
  }
}

/**
 * 获取网络信息，不包括回环地址信息
 */
export function retrieveExternalNetWorkInfo(): NetworkInterfaceInfo[] {
  const ret = Object.entries(networkInterfaces()).reduce((acc: NetworkInterfaceInfo[], curr) => {
    const [, nets] = curr
    /* c8 ignore next 3 */
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


