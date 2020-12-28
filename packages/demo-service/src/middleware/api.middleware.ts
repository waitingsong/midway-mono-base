import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'
import { Context } from 'egg'


@Provide()
export class ApiMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return apiMiddleware
  }

}

async function apiMiddleware(ctx: Context, next: IMidwayWebNext): Promise<void> {
  /* istanbul ignore else */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (! ctx.api) {
    ctx.api = {
      reqTimeStr: new Date().toLocaleString(),
    }
  }
  await next()
}


declare module 'egg' {
  interface Context {
    api: {
      /** Request time string from api.middleware.ts */
      reqTimeStr: string,
    }
  }
}

