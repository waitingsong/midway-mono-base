/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'tsconfig-paths/register'

import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { initTaskManClientConfig, TaskManClientConfig } from '@mw-components/taskman'

import { testConfig } from './test-config'


/**
 * @see https://mochajs.org/#root-hook-plugins
 * beforeAll:
 *  - In serial mode(Mocha’s default ), before all tests begin, once only
 *  - In parallel mode, run before all tests begin, for each file
 * beforeEach:
 *  - In both modes, run before each test
 */
export const mochaHooks = async () => {
  // avoid run multi times
  if (! process.env.mochaRootHookFlag) {
    process.env.mochaRootHookFlag = 'true'
  }

  return {
    beforeAll: async () => {
      const app = await createApp<Framework>()
      testConfig.app = app
      const httpRequest = createHttpRequest(app)
      testConfig.httpRequest = httpRequest

      const { url } = httpRequest.get('/')
      app.addConfigObject({
        taskManClientConfig: {
          ...initTaskManClientConfig,
          host: url.slice(0, -1),
        },
      })
      const tmcConfig = app.getConfig('taskManClientConfig') as TaskManClientConfig
      const host = tmcConfig.host
      console.info('taskManClientConfig.host', host)
    },

    beforeEach: async () => {
    },

    afterEach: async () => {
    },

    afterAll: async () => {
      if (testConfig.app) {
        await close(testConfig.app)
      }
    },
  }

}

