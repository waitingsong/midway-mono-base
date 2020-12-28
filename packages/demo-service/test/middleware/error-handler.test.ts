/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename, join } from '@waiting/shared-core'
import { Application, Context } from 'egg'

import { ErrorHandlerMiddleware } from '~/middleware/error-handler.middleware'
import MyError from '~/util/my-error'


const assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })


  it('should 404 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 404
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { body, status, reqId } = ctx
    assert(status === 404)

    assert(body.reqId === reqId && typeof reqId === 'string')
    assert(body.code === status)
    assert(body.msg === 'Not Found')
  })

  it('should 422 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, nextThrowError)

    const { status, body, reqId } = ctx
    assert(status === 422, status.toString())
    assert(body.code === 422)
    assert(body.reqId === reqId && typeof reqId === 'string')
    assert(body.msg === 'ValidationError')
  })

  it('should wrapRespForJson() works with json wrap', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const payload = Math.random().toString()
    // set  ctx.response.headers['content-type'] with 'application/json'
    ctx.body = {
      dat: payload,
    }
    ctx.body = payload

    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { body, status, reqId } = ctx
    assert(status === 200)

    assert(body.reqId === reqId && typeof reqId === 'string')
    assert(body.code === status)
    assert(body.dat === payload)
  })

  it('should wrapRespForJson() works without wrap', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const payload = Math.random().toString()
    ctx.body = payload

    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { body, status, reqId } = ctx
    assert(status === 200)

    assert(typeof body.reqId === 'undefined')
    assert(typeof body.code === 'undefined')
    assert(typeof body.dat === 'undefined')
    assert(body === payload)
  })


})


async function next(): Promise<void> {
  return void 0
}

async function nextThrowError(): Promise<void> {
  throw new MyError('ValidationError')
}

