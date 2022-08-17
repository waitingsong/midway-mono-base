import {
  Config,
  ContentType,
  Controller,
  Get,
  Inject,
  Provide,
} from '@midwayjs/decorator'
import { AppInfomation } from '@mw-components/share'

import { HomeService } from './home.service'

import { BaseController } from '~/interface'


@Provide()
@Controller('/')
export class HomeController extends BaseController {

  @Config() readonly welcomeMsg: string

  @Inject() readonly svc: HomeService

  @ContentType('text')
  @Get('/')
  index(): string {
    let body = this.welcomeMsg
    const info: AppInfomation = this.svc.appInfo()
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
  @Get('/hello')
  hello(): string {
    let body = this.welcomeMsg
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
    const body = await this.svc.retrieveGatewayIp()
    return body
  }

}

