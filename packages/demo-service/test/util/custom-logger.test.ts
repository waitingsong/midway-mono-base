import { relative } from 'path'

import {
  clearAllLoggers,
  createFileLogger,
} from '@midwayjs/logger'
import { join } from '@waiting/shared-core'

import { removeFileOrDir, sleep, matchISO8601ContentTimes, getCurrentDateString } from './util'

import { updateTransformableInfo } from '~/util/custom-logger'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  const logsDir = join(__dirname, 'logs')

  after(() => {
    removeFileOrDir(logsDir).catch(() => { void 0 })
  })


  it('should dynamic change info data', async () => {
    clearAllLoggers()
    await removeFileOrDir(logsDir)

    const fileLogName = 'test-logger.log'

    const logger = createFileLogger('file', {
      dir: logsDir,
      fileLogName,
    })

    // @ts-expect-error
    logger.updateTransformableInfo(updateTransformableInfo)
    logger.info('file logger')
    logger.warn('file logger1')
    logger.error('file logger2')
    await sleep()

    const dd = new Date()
    const d1 = getCurrentDateString() // 2021-03-18
    const d2 = dd.getHours().toString().padStart(2, '0')
    const tzo = -dd.getTimezoneOffset()
    const dif = tzo >= 0 ? '\\+' : '-'
    const off1 = pad(tzo / 60, 2)
    const off2 = pad(tzo % 60, 2)

    // '2021-03-17T19:47:28.123+08:00
    const needle = new RegExp(`${d1}T${d2}:\\d{2}:\\d{2}\\.\\d{3}${dif}${off1}:${off2}\\s`, 'ug')
    const ret = matchISO8601ContentTimes(join(logsDir, fileLogName), needle)
    assert(ret === 3)
  })

})

function pad(num: number, length: number): string {
  const norm = Math.floor(Math.abs(num))
  return norm.toString().padStart(length, '0')
}

