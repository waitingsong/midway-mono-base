/* eslint-disable import/no-extraneous-dependencies */
import 'tsconfig-paths/register'

import { ILifeCycle } from '@midwayjs/core'
import { Configuration, App } from '@midwayjs/decorator'
import { Application } from 'egg'

@Configuration()
export class ContainerConfiguration implements ILifeCycle {

  constructor(@App() readonly app: Application) { }

  // 启动前处理
  async onReady(): Promise<void> {
    void 0
  }

  // 可以在这里做些停止后处理
  // async onStop(): Promise<void> {}

}

