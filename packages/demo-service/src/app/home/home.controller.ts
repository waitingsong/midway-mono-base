import {
  Config,
  Controller,
  Get,
  Inject,
  Plugin,
  Provide,
} from '@midwayjs/decorator'
import { Fetch } from '@waiting/egg-fetch'
import { NpmPkg } from '@waiting/shared-types'
import { Context } from 'egg'
import type { Koid } from 'egg-koid'

import { HomeService } from './home.service'

import { BaseController } from '~/interface'


@Provide()
@Controller('/')
export class HomeController extends BaseController {

  @Config() readonly pkg: NpmPkg

  @Config() readonly welcomeMsg: string

  @Plugin() readonly fetch: Fetch

  @Plugin() readonly koid: Koid

  @Inject() readonly homeService: HomeService


  @Get('/', { middleware: ['apiMiddleware'] })
  index(ctx: Context): string {
    const { reqId } = ctx
    let body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
    body += `\npkgName: "${this.pkg.name}"\npkgVer: "${this.pkg.version ?? 'n/a'}"`
    body += `\nreqId: "${reqId}"`
    return body
  }

  @Get('/ping')
  ping(): string {
    return 'OK'
  }

  @Get('/hello', { middleware: ['apiMiddleware'] })
  hello(ctx: Context): void {
    let msg = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
    msg += `\npkgName: "${this.pkg.name}"\npkgVer: "${this.pkg.version ?? 'n/a'}"`
    ctx.body = msg
  }

  @Get('/token')
  token(ctx: Context): string {
    const payload = ctx.jwtState?.user ? JSON.stringify(ctx.jwtState.user) : 'Not found'
    const body = `\nRequest: ${payload}`
    return body
  }

  @Get('/test_sign')
  sign(): unknown {
    const payload = { foo: 'bar' }
    const token = this.homeService.jwtSign(payload)
    const valid = this.homeService.jwtVerify(token)

    // const body = `\nPayload: ${JSON.stringify(payload)}\nToken: ${token}\nResult: ${JSON.stringify(valid)}`
    const ret = {
      payload,
      token,
      result: valid,
    }
    return ret
  }

  @Get('/ip')
  async ip(): Promise<string> {
    const body = this.homeService.retrieveGatewayIp()
    return body
  }

  @Get('/test_err')
  testError(): never {
    // HTTP Response Code is 200, Result.code is 2404
    this.throwError('管理员不存在，请检查', 2404)
  }

}

