import 'tsconfig-paths/register'
import { join } from 'node:path'

import {
  App,
  Configuration,
  ILifeCycle,
  Inject,
  Logger,
  MidwayInformationService,
} from '@midwayjs/core'
import { IMidwayLogger } from '@midwayjs/logger'
import { Application, IMidwayContainer } from '@mwcp/boot'

import { useComponents } from './imports'


@Configuration({
  importConfigs: [join(__dirname, 'config')],
  imports: useComponents,
})
export class ContainerConfiguration implements ILifeCycle {

  @App() readonly app: Application

  @Logger() readonly logger: IMidwayLogger

  @Inject() readonly informationService: MidwayInformationService

  // 启动前处理
  async onReady(container: IMidwayContainer): Promise<void> {
    void container
  }

  async onServerReady(container: IMidwayContainer): Promise<void> {
    void container
    // eslint-disable-next-line no-console
    console.log('✅ Your APP launched')
  }

  async onStop(): Promise<void> {
    return
  }

}

