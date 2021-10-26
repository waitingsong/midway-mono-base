import { relative } from 'path'

import { KoidComponent } from '@mw-components/koid'
import { testConfig } from 'test/root.config'

import { HeadersKey } from '~/constant'
import { NpmPkg, TracerTag } from '~/interface'
import { ResponseHeadersMiddleware } from '~/middleware/response-headers.middleware'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should work', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext()

    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(ResponseHeadersMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const pkg = ctx.app.getConfig('pkgJson') as NpmPkg
    const { headers } = ctx.response
    assert(headers[TracerTag.svcName] === pkg.name)
    assert(headers[TracerTag.svcVer] === pkg.version)
  })

  it('should work with existing header', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext()
    ctx.status = 200

    const name = Math.random().toString()
    ctx.set(TracerTag.svcName, name)

    const inst = await ctx.requestContext.getAsync(ResponseHeadersMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const pkg = ctx.app.getConfig('pkgJson') as NpmPkg
    const { headers } = ctx.response
    assert(headers[TracerTag.svcName] === name)
  })

})

