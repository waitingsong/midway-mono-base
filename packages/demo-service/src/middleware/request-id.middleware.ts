import { Middleware } from '@midwayjs/decorator'
import { KoidComponent } from '@mw-components/koid'


import { HeadersKey } from '~/constant'
import { Context, IMiddleware, NextFunction } from '~/interface'


@Middleware()
export class RequestIdMiddleware implements IMiddleware<Context, NextFunction> {

  static getName(): string {
    const name = 'requestIdMiddleware'
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
): Promise<unknown> {

  const key = HeadersKey.reqId
  let reqId = ctx.get(key)

  if (reqId) {
    ctx.reqId = reqId
  }
  else {
    const koid = await ctx.requestContext.getAsync(KoidComponent)
    reqId = koid.idGenerator.toString()
    ctx.reqId = reqId
  }

  ctx.set(key, reqId)

  return next()
}


declare module '@midwayjs/core/dist/interface' {
  interface Context {
    reqId: string
  }
}
