import { relative } from 'path'

import { JsonResp } from '@waiting/shared-types'

import { testConfig } from '@/root.config'
import { Context } from '~/interface'
import { ErrorHandlerMiddleware } from '~/middleware/error-handler.middleware'
import MyError from '~/util/my-error'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should 404 work', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<JsonResp>

    ctx.status = 404
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-ignore
    await mw(ctx, next)

    const { body, status } = ctx
    assert(status === 404)

    assert(body.code === status)
    assert(body.msg === 'Not Found')
  })

  it('should 422 work', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext() as Context<JsonResp>

    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-ignore
    await mw(ctx, nextThrowError)

    const { status, body } = ctx
    assert(status === 422, status.toString())
    assert(body.code === 422)
    assert(body.msg === 'ValidationError')
  })

  it('should wrapRespForJson() work with json wrap', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<JsonResp<string>>

    ctx.status = 200
    const payload = Math.random().toString()
    // set  ctx.response.headers['content-type'] with 'application/json'
    // @ts-ignore
    ctx.body = {
      data: payload,
    }
    // @ts-ignore
    ctx.body = payload

    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-ignore
    await mw(ctx, next)

    const { body, status } = ctx
    assert(status === 200)
    assert(body.code === 0)
    assert(body.data === payload)
  })

  it('should wrapRespForJson() work without wrap', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<string>

    ctx.status = 200
    const payload = Math.random().toString()
    ctx.body = payload

    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-ignore
    await mw(ctx, next)

    const { body, status } = ctx
    assert(status === 200)

    // @ts-ignore
    assert(typeof body.reqId === 'undefined')
    // @ts-ignore
    assert(typeof body.code === 'undefined')
    // @ts-ignore
    assert(typeof body.data === 'undefined')
    assert(body === payload)
  })

})


async function nextThrowError(): Promise<void> {
  throw new MyError('ValidationError')
}

