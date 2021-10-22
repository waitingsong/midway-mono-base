import {
  Config,
  ContentType,
  Controller,
  Get,
  Inject,
  Provide,
} from '@midwayjs/decorator'

import { HomeService } from './home.service'

import { BaseController } from '~/interface'


@Provide()
@Controller('/')
export class HomeController extends BaseController {

  @Config() readonly welcomeMsg: string

  @Inject() readonly svc: HomeService

  @ContentType('text')
  @Get('/', { middleware: ['apiMiddleware'] })
  index(): string {
    let body = `${this.welcomeMsg} - ${this.ctx.api.reqTimeStr}`
    const info = this.svc.appInfo()
    Object.entries(info).forEach(([key, val]) => {
      body += `\n${key}: "${val}"`
    })
    body += '\n'
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
    let body = `${this.welcomeMsg} - ${this.ctx.api.reqTimeStr}`
    const info = this.svc.appInfo()
    Object.entries(info).forEach(([key, val]) => {
      body += `\n${key}: "${val}"`
    })
    body += '\n'
    return body
  }

  @ContentType('text')
  @Get('/ip')
  async ip(): Promise<string> {
    const body = this.svc.retrieveGatewayIp()
    return body
  }

}

