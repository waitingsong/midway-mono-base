// https://mochajs.org/#global-fixtures
// https://mochajs.org/#root-hook-plugins
import assert from 'node:assert'

import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import type { NpmPkg } from '@mwcp/boot'
import { ValidateService } from '@mwcp/boot'
import { JwtComponent } from '@mwcp/jwt'
import { DbSourceManager } from '@mwcp/kmore'
import type { Application } from '@mwcp/share'
// import {
//   TaskClientConfig,
//   ConfigKey as TaskmanConfigKey,
// } from '@mwcp/taskman'
import type { Suite } from 'mocha'

import type { TestConfig } from './root.config.js'
import { testConfig } from './root.config.js'


let app: Application

export async function mochaGlobalSetup(this: Suite) {
  app = await createAppInstance()
  await updateConfig(app, testConfig)
  await updateConfig2(app, testConfig)
}

export async function mochaGlobalTeardown(this: Suite) {
  await clean(app, testConfig)
  await close(app)
}


/**
 * Update testConfig in place
 */
async function createAppInstance(): Promise<Application> {
  try {
    app = await createApp() as Application
  }
  catch (ex) {
    console.error('createApp error:', ex)
    throw ex
  }

  assert(app, 'app not exists')

  const middlewares = app.getMiddleware().getNames()
  console.info({ middlewares })

  return app
  // https://midwayjs.org/docs/testing
}

async function updateConfig(mockApp: Application, config: TestConfig): Promise<void> {
  config.app = mockApp
  config.httpRequest = createHttpRequest(mockApp)

  assert(config.httpRequest, 'httpRequest not exists')
  const { url } = config.httpRequest.get('/')
  config.host = url

  config.container = mockApp.getApplicationContext()
  config.validateService = await config.container.getAsync(ValidateService)
  // const svc = await testConfig.container.getAsync(TaskQueueService)
}

async function updateConfig2(mockApp: Application, config: TestConfig): Promise<void> {
  // mockApp.addConfigObject({
  //   [TaskmanConfigKey.clientConfig]: {
  //     host: config.host.slice(0, -1),
  //   },
  // })

  config.jwt = await config.container.getAsync(JwtComponent)
  config.pkg = mockApp.getConfig('pkg') as NpmPkg

  // const tmcConfig = mockApp.getConfig(TaskmanConfigKey.clientConfig) as TaskClientConfig
  // const host = tmcConfig.host
  // console.info('taskClientConfig.host', host)

  const dbManager = await config.container.getAsync(DbSourceManager)
  assert(dbManager)
}

async function clean(mockApp: Application, config: TestConfig): Promise<void> {
  void mockApp
  void config
}
