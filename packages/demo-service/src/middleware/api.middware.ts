import { Middleware, WebMiddleware, provide } from 'midway'


@provide()
export class ApiMiddleware implements WebMiddleware {

  public resolve(): Middleware {
    return async (ctx, next) => {
      ctx.api = {
        reqTimeStr: new Date().toLocaleString(),
      }
      await next()
    }
  }

}

declare module 'egg' {
  interface Context {
    api: {
      /** From api.middleware.ts */
      reqTimeStr: string,
    }
    jwtState?: {
      user: string,
    }
  }
}
