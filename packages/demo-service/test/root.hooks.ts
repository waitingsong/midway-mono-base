import 'tsconfig-paths/register'
import assert from 'node:assert/strict'
import { join } from 'node:path'

import * as WEB from '@midwayjs/koa'
import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import type {
  Application,
  NpmPkg,
} from '@mwcp/boot'
import { JwtComponent } from '@mwcp/jwt'
import { DbSourceManager } from '@mwcp/kmore'
import {
  TaskClientConfig,
  ConfigKey as TCK,
} from '@mwcp/taskman'

import { testConfig } from './root.config'


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
  if (! process.env['mochaRootHookFlag']) {
    process.env['mochaRootHookFlag'] = 'true'
  }

  return {
    beforeAll: async () => {
      const globalConfig = {
        keys: Math.random().toString(),
      }
      const opts = {
        imports: [WEB],
        globalConfig,
      }
      // const app = await createApp(join(__dirname, 'fixtures', 'base-app'), opts) as Application
      const app = await createApp(join(__dirname, '..'), opts) as Application
      app.addConfigObject(globalConfig)
      testConfig.app = app
      testConfig.httpRequest = createHttpRequest(app)
      const { url } = testConfig.httpRequest.get('/')
      testConfig.host = url

      const container = app.getApplicationContext()
      testConfig.container = container

      testConfig.jwt = await container.getAsync(JwtComponent)
      testConfig.pkg = app.getConfig('pkg') as NpmPkg

      app.addConfigObject({
        [TCK.clientConfig]: {
          host: url.slice(0, -1),
        },
      })
      const tmcConfig = app.getConfig(TCK.clientConfig) as TaskClientConfig
      const host = tmcConfig.host
      console.info('taskClientConfig.host', host)

      const dbManager = await container.getAsync(DbSourceManager)
      assert(dbManager)

    },

    beforeEach: async () => {
      return
    },

    afterEach: async () => {
      return
    },

    afterAll: async () => {
      if (testConfig.app) {
        await close(testConfig.app)
      }
    },
  }

}

