import {
  Config,
  ContentType,
  Controller,
  Get,
  Inject,
  Provide,
} from '@midwayjs/decorator'

import { HomeService } from './home.service'

import { BaseController, NpmPkg } from '~/interface'


@Provide()
@Controller('/')
export class HomeController extends BaseController {

  @Config() readonly pkgJson: NpmPkg
  @Config() readonly welcomeMsg: string

  @Inject() readonly svc: HomeService

  @ContentType('text')
  @Get('/', { middleware: ['apiMiddleware'] })
  index(): string {
    const { reqId } = this.ctx
    let body = `${this.welcomeMsg} - ${this.ctx.api.reqTimeStr}`
    body += `\npkgName: "${this.pkgJson.name}"\npkgVer: "${this.pkgJson.version ?? 'n/a'}"`
    body += `\nreqId: "${reqId}"\n`
    return body
  }

  @ContentType('text')
  @Get('/ping')
  ping(): string {
    return 'OK'
  }

  @ContentType('text')
  @Get('/hello', { middleware: ['apiMiddleware'] })
  hello(): string {
    let msg = `${this.welcomeMsg} - ${this.ctx.api.reqTimeStr}`
    msg += `\npkgName: "${this.pkgJson.name}"\npkgVer: "${this.pkgJson.version ?? 'n/a'}"\n`
    return msg
  }

  @ContentType('text')
  @Get('/ip')
  async ip(): Promise<string> {
    const body = this.svc.retrieveGatewayIp()
    return body
  }

}

