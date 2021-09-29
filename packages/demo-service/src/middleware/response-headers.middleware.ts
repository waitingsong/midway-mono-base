import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'

import { Context, NpmPkg, TracerTag } from '~/interface'

/**
 * 设置默认响应 ContentType
 */
@Provide()
export class ResponseHeadersMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return responseHeaders
  }

}

async function responseHeaders(ctx: Context, next: IMidwayWebNext): Promise<void> {
  await next()

  const { headers } = ctx.response
  const pkg = ctx.app.getConfig('pkgJson') as NpmPkg

  if (! headers[TracerTag.svcName]) {
    ctx.set(TracerTag.svcName, pkg.name)
  }

  if (! headers[TracerTag.svcVer] && pkg.version) {
    ctx.set(TracerTag.svcVer, pkg.version)
  }
}

