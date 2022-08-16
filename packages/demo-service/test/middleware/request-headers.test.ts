import assert from 'node:assert/strict'
import { relative } from 'node:path'

import type {
  HeadersKey,
  NpmPkg,
  TracerTag,
} from '@mw-components/share'

import { testConfig } from '@/root.config'
import { ResponseHeadersMiddleware } from '~/middleware/response-headers.middleware'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should work', async () => {
    // const { app, next } = testConfig
    // const ctx = app.createAnonymousContext()

    // ctx.status = 200
    // const inst = await ctx.requestContext.getAsync(ResponseHeadersMiddleware)
    // const mw = inst.resolve()
    // // @ts-ignore
    // await mw(ctx, next)

    // const pkg = ctx.app.getConfig('pkgJson') as NpmPkg
    // const { headers } = ctx.response
    // assert(headers[TracerTag.svcName] === pkg.name)
    // assert(headers[TracerTag.svcVer] === pkg.version)
  })

  it('should work with existing header', async () => {
    // const { app } = testConfig
    // const ctx = app.createAnonymousContext()
    // ctx.status = 200

    // const name = Math.random().toString()
    // ctx.set(TracerTag.svcName, name)

    // const inst = await ctx.requestContext.getAsync(ResponseHeadersMiddleware)
    // const mw = inst.resolve()
    // // @ts-ignore
    // await mw(ctx, next)

    // const pkg = ctx.app.getConfig('pkgJson') as NpmPkg
    // const { headers } = ctx.response
    // assert(headers[TracerTag.svcName] === name)
  })

})

