
import {
  App,
  Configuration,
  ILifeCycle,
  Inject,
  Logger,
  MidwayInformationService,
  MidwayWebRouterService,
} from '@midwayjs/core'
import { IMidwayLogger } from '@midwayjs/logger'
import { Application, IMidwayContainer, TraceInit } from '@mwcp/boot'
import { registerMiddleware } from '@mwcp/share'

import * as DefulatConfig from './config/config.default.js'
import * as LocalConfig from './config/config.local.js'
import * as ProdConfig from './config/config.prod.js'
import * as UnittestConfig from './config/config.unittest.js'
import { useComponents } from './imports.js'


@Configuration({
  importConfigs: [
    {
      default: DefulatConfig,
      local: LocalConfig,
      prod: ProdConfig,
      unittest: UnittestConfig,
    },
  ],
  imports: useComponents,
})
export class ContainerConfiguration implements ILifeCycle {
  @App() readonly app: Application

  @Inject() webRouterService: MidwayWebRouterService

  @Logger() readonly logger: IMidwayLogger

  @Inject() readonly informationService: MidwayInformationService

  // 启动前处理
  @TraceInit({ namespace: 'demo' })
  async onReady(container: IMidwayContainer): Promise<void> {
    void container
    void registerMiddleware
    // const mws = []
    // registerMiddleware(this.app, mws)
  }

  @TraceInit({ namespace: 'demo' })
  async onServerReady(container: IMidwayContainer): Promise<void> {
    void container
    this.logger.info('✅ Your APP launched')
  }

  async onStop(): Promise<void> {
    return
  }

}

