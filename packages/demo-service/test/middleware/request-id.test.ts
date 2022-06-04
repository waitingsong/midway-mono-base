import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { KoidComponent } from '@mw-components/koid'

import { testConfig } from '@/root.config'
import { HeadersKey } from '~/constant'
import { RequestIdMiddleware } from '~/middleware/request-id.middleware'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should work', async () => {
    // const { app } = testConfig
    // const key = HeadersKey.reqId
    // const ctx = app.createAnonymousContext()
    // ctx.status = 200
    // const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
    // const mw = inst.resolve()
    // // @ts-ignore
    // await mw(ctx, next)

    // const { status, reqId } = ctx
    // assert(status === 200)
    // assert(reqId && reqId.length)

    // const koid = await ctx.requestContext.getAsync(KoidComponent)
    // const info = koid.retrieveFromId(reqId)
    // assert(typeof info.dataCenter === 'number')
    // assert(typeof info.worker === 'number')
    // assert(typeof info.timestamp === 'number')

    // const xReqId = ctx.response.get(key)
    // assert(xReqId === reqId)
  })

  it('should work with existing x-request-id header', async () => {
    // const { app } = testConfig
    // const key = HeadersKey.reqId
    // const ctx = app.createAnonymousContext()
    // ctx.status = 200
    // const payload = Math.random().toString()
    // // set  ctx.response.headers['content-type'] with 'application/json'
    // ctx.body = {
    //   dat: payload,
    // }
    // ctx.body = payload

    // const input = Math.random().toString()
    // assert(input.length)
    // // ctx.set(key, input) not works
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // ctx.request.headers[key] = input

    // const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
    // const mw = inst.resolve()
    // // @ts-ignore
    // await mw(ctx, next)

    // const { status, reqId } = ctx
    // assert(status === 200)

    // const xReqId = ctx.response.get(key)
    // assert(xReqId === reqId)
    // assert(xReqId === input)
  })

})

