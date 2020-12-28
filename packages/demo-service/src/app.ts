/* eslint-disable no-console */
import { NpmPkg } from '@waiting/shared-types'
import { Application } from 'egg'


// https://eggjs.org/zh-cn/advanced/loader.html
export default class AppBootHook {

  constructor(public readonly app: Application) {
  }

  // configWillLoad(): void {
  //   console.log('🚀 Your APP is launching...')
  // }

  // Config, plugin files have been loaded.
  configDidLoad(): void {
    // 增加全局错误处理中间件
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.app.config.coreMiddleware.unshift('errorHandlerMiddleware')
  }

  async serverDidReady(): Promise<void> {
    // Server is listening.
    const { pkg }: { pkg: NpmPkg } = this.app.config
    const info = {
      pkgName: pkg.name,
      pkgVersion: pkg.version,
    }
    console.log('✅ Your APP launched', info)
  }

  // async beforeClose(): Promise<void> {
  //   console.log('Your APP Closed')
  // }

}

