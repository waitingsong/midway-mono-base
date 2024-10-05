import { existsSync, readFileSync } from 'node:fs'

import { sleep } from '@waiting/shared-core'
import { remove } from 'fs-extra'


export { sleep }


export async function removeFileOrDir(path: string): Promise<void> {
  await remove(path)
  await sleep(500)
}


export function matchISO8601ContentTimes(path: string, matchString: string | RegExp): number {
  let content: string | void = ''
  const path2 = path + '.' + getCurrentDateString()

  if (existsSync(path)) {
    content = readFileSync(path, { encoding: 'utf8' })
  }
  else if (existsSync(path2)) {
    content = readFileSync(path2, { encoding: 'utf8' })
  }

  if (! content) {
    return 0
  }

  const regex = typeof matchString === 'string'
    ? new RegExp(matchString, 'ug')
    : matchString


  const ret = content.match(regex) ?? []
  return ret.length
}


export function getCurrentDateString(): string {
  const dd = new Date()
  return `${dd.getFullYear()}-${(dd.getMonth() + 1).toString().padStart(2, '0')}-${dd.getDate().toString().padStart(2, '0')}`
}

