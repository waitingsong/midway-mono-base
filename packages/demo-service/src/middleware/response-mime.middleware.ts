import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'

import { Context } from '~/interface'

/**
 * 设置默认响应 ContentType
 */
@Provide()
export class ResponseMimeMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return responseMimeMiddleware
  }

}

/**
 * 若未通过 `@ContentType(string)` 显式设置头部，则设置默认为 `application/json`
 */
async function responseMimeMiddleware(ctx: Context, next: IMidwayWebNext): Promise<void> {
  await next()

  const key = 'content-type'
  const mime = ctx.response.headers[key]

  /* istanbul ignore else */
  if (! mime) {
    ctx.set(key, 'application/json')
  }
}

