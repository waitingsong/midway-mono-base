import assert from 'assert/strict'
import { relative } from 'path'

import { TaskClientConfig } from '@mw-components/taskman'

import { testConfig } from './root.config'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  describe('should work', () => {
    it('always passed', () => {
      const taskClientConfig = testConfig.app.getConfig('taskClientConfig') as TaskClientConfig
      const host = taskClientConfig.host
      console.info(host)
      assert(parseInt(new URL(host).port) > 10000)
      assert(true)
    })
  })

  before(async () => {
    const { app } = testConfig
    const hosts = app.getConfig('svcHosts') as Record<string, string>
    assert(hosts)
    assert(hosts.uc)
  })
})

