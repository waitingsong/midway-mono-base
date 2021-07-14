import assert from 'assert'
import { IncomingHttpHeaders } from 'http'

import {
  Config,
  ContentType,
  Controller,
  Get,
  Inject,
  Provide,
} from '@midwayjs/decorator'

import { TestService } from './test.service'

import { HeadersKey } from '~/constant'
import { BaseController, NpmPkg } from '~/interface'


@Provide()
@Controller('/test')
export class TestController extends BaseController {

  @Config() readonly pkgJson: NpmPkg
  @Config() readonly welcomeMsg: string

  @Inject() readonly svc: TestService

  @ContentType('text')
  @Get('/token')
  token(): string {
    const payload = this.ctx.jwtState?.user ? JSON.stringify(this.ctx.jwtState.user) : 'Not found'
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
    this.throwError('管理员不存在，请检查', 2404)
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
    const { headers } = this.ctx.request
    assert(typeof headers[HeadersKey.traceId] === 'undefined')

    const spanHeader = this.ctx.tracerManager.headerOfCurrentSpan()
    assert(spanHeader)
    const expect = {
      reqId: this.ctx.reqId,
      traceId: spanHeader[HeadersKey.traceId],
      traceIdArr: spanHeader[HeadersKey.traceId].split(':'),
    }

    const ret = await this.getJson<TestData>('http://localhost:7001/test/_fetch_target')

    const body = {
      firstTraceId: expect.traceId,
      fisrtHeaders: this.ctx.request.headers,
      upstreamData: ret.data,
    }
    assert(expect.reqId, body.upstreamData.reqId)

    const upstreamTraceId = body.upstreamData.headers[HeadersKey.traceId] as string
    assert(upstreamTraceId)
    const upstreamTraceIdArr = upstreamTraceId.split(':')
    assert(expect.traceIdArr[0] === upstreamTraceIdArr[0])
    assert(expect.traceIdArr[1] !== upstreamTraceIdArr[1])
    assert(expect.traceIdArr[2] === '0')
    assert(expect.traceIdArr[0] === upstreamTraceIdArr[2])

    const { nextTraceId } = body.upstreamData
    assert(typeof nextTraceId === 'string' && nextTraceId.length)
    const nextTraceIdArr = nextTraceId.split(':')
    assert(nextTraceIdArr[0] === upstreamTraceIdArr[0])
    assert(nextTraceIdArr[2] === upstreamTraceIdArr[1])

    return JSON.stringify(body, null, 2)
  }

  @Get('/_fetch_target')
  fetchTarget(): TestData {
    const { headers } = this.ctx.request
    const traceId = headers[HeadersKey.traceId]
    this.logger.log({ traceId })
    assert(typeof traceId === 'string' && traceId.length, 'Should accese path: \'/test/fetch\' for test')

    const spanHeader = this.ctx.tracerManager.headerOfCurrentSpan()
    assert(spanHeader)
    const nextTraceId: string = spanHeader[HeadersKey.traceId]
    const body = {
      reqId: this.ctx.reqId,
      nextTraceId,
      headers: this.ctx.request.headers,
    }
    assert(body.reqId === this.ctx.reqId)

    return body
  }
}

interface TestData {
  reqId: string
  headers: IncomingHttpHeaders
  nextTraceId: string
}

