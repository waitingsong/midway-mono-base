import {
  Context, config, controller, get, provide, plugin,
} from 'midway'
import { Fetch, RxRequestInit } from '@waiting/egg-fetch'
import { Jwt } from '@waiting/egg-jwt'
import { NpmPkg } from '@waiting/shared-types'


@provide()
@controller('/')
export class HomeController {

  constructor(
    @config() private readonly pkg: NpmPkg,
    @config() private readonly welcomeMsg: string,
    @plugin() private readonly fetch: Fetch,
    @plugin() private readonly jwt: Jwt,
  ) { }

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    const msg = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}
pkgName: "${this.pkg.name}"
pkgVer: "${this.pkg.version}"
    `
    ctx.body = msg
  }

  @get('/ping')
  public ping(ctx: Context): void {
    ctx.body = 'OK'
  }

  @get('/hello', { middleware: ['apiMiddleware'] })
  public hello(ctx: Context): void {
    const msg = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}
pkgName: "${this.pkg.name}"
pkgVer: "${this.pkg.version}"
    `
    ctx.body = msg
  }

  @get('/token')
  public token(ctx: Context) {
    const payload = ctx.state && ctx.state.user ? JSON.stringify(ctx.state.user) : 'Not found'
    ctx.body = `\nRequest: ${payload}`
  }

  @get('/test_sign')
  public sign(ctx: Context) {
    const payload = { foo: 'bar' }
    const token = this.jwt.sign(payload)
    const valid = this.jwt.verify(token)

    ctx.body = `\nPayload: ${JSON.stringify(payload)}\nToken: ${token}\nResult: ${JSON.stringify(valid)}`
  }

  @get('/ip')
  public async ip(ctx: Context) {
    // const url = 'http://ip.360.cn/IPShare/info'
    const url = 'https://www.taobao.com/help/getip.php'
    const args: RxRequestInit = {
      dataType: 'text',
    }
    // ipCallback({ip:"222.233.10.1"})
    const html = await this.fetch.get<string>(url, args).toPromise()

    ctx.body = html
  }

}
