import { Middleware } from '@midwayjs/decorator'
import { Context, IMiddleware, NextFunction, NpmPkg, TracerTag } from '@mw-components/share'


/**
 * 设置默认响应 ContentType
 */
@Middleware()
export class ResponseHeadersMiddleware implements IMiddleware<Context, NextFunction> {

  static getName(): string {
    const name = 'responseHeadersMiddleware'
    return name
  }

  match(ctx?: Context) {
    const flag = !! ctx
    return flag
  }

  resolve() {
    return middleware
  }

}


async function middleware(
  ctx: Context,
  next: NextFunction,
): Promise<void> {

  await next()

  const { headers } = ctx.response
  const pkg = ctx.app.getConfig('pkg') as NpmPkg

  if (! headers[TracerTag.svcName]) {
    ctx.set(TracerTag.svcName, pkg.name)
  }

  if (! headers[TracerTag.svcVer] && pkg.version) {
    ctx.set(TracerTag.svcVer, pkg.version)
  }
}

