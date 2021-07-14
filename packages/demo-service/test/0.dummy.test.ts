import { TaskManClientConfig } from '@mw-components/taskman'
import {
  basename,
  join,
} from '@waiting/shared-core'

import { testConfig } from './test-config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('should works', () => {
    it('always passed', () => {
      const host = (testConfig.app.config.taskManClientConfig as TaskManClientConfig).host as string
      console.info(host)
      assert(parseInt(new URL(host).port) > 10000)
      assert(true)
    })
  })

  before(async () => {
    const { app } = testConfig
    const hosts = app.getConfig('svcHosts') as { uc: string }
    assert(hosts)
  })
})

