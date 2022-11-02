import 'tsconfig-paths/register'
import { join } from 'node:path'

import { ILifeCycle, MidwayInformationService } from '@midwayjs/core'
import {
  App,
  Configuration,
  Inject,
  Logger,
} from '@midwayjs/decorator'
import { IMidwayLogger } from '@midwayjs/logger'
import { Application } from '@mwcp/boot'

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
  async onReady(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('✅ Your APP launched')
  }

  async onStop(): Promise<void> {
    return
  }

}

