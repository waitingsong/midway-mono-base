import assert from 'assert/strict'
import type { IncomingHttpHeaders } from 'http'

import {
  Config,
  ContentType,
  Controller,
  Get,
  Inject,
  Provide,
} from '@midwayjs/decorator'

import { TestService } from './test.service'

import { BaseController } from '~/interface'


@Provide()
@Controller('/test')
export class TestController extends BaseController {

  @Config() readonly welcomeMsg: string

  @Inject() readonly svc: TestService

  @ContentType('text')
  @Get('/token')
  token(): string {
    const payload = this.ctx.jwtState.user ? JSON.stringify(this.ctx.jwtState.user) : 'Not found'
    const body = `\nRequest: ${payload}`
    return body
  }

  @Get('/sign')
  sign(): unknown {
    const payload = { foo: 'bar' }
    const token = this.svc.jwtSign(payload)
    const valid = this.svc.jwtVerify(token)

    // const body = `\nPayload: ${JSON.stringify(payload)}\nToken: ${token}\nResult: ${JSON.stringify(valid)}`
    const ret = {
      payload,
      token,
      result: valid,
    }
    return ret
  }

  @Get('/err')
  testError(): never {
    // HTTP Response Code is 200, Result.code is 2404
    this.throwError('管理员不存在，请检查', this.globalErrorCode.E_Admin_Not_Exists)
  }

  @Get('/array')
  testArray(): (string|number)[] {
    this.logger.info('return array with JsonResp<T> structure')
    return ['a', 'b', 1]
  }

  @Get('/blank')
  blank(): string {
    this.logger.info('return blank with JsonResp<T> structure')
    return ''
  }

  @Get('/empty')
  empty(): void {
    this.logger.info('return empty with JsonResp<T> structure')
  }

  @Get('/no_output')
  noOutput(): void {
    this.logger.info('no output with http code 204')
  }

  @ContentType('text')
  @Get('/fetch')
  async fetchSelf(): Promise<string> {
    const ret = await this.getJson<TestData>('http://localhost:7001/test/_fetch_target')
    assert(ret)
    return JSON.stringify(ret, null, 2)
  }

  @Get('/_fetch_target')
  async fetchTarget(): Promise<TestData> {
    const body = {
      headers: this.ctx.request.headers,
    }
    return body
  }

}

interface TestData {
  headers: IncomingHttpHeaders
}

