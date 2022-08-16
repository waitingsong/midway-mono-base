import { Middleware } from '@midwayjs/decorator'
import type {
  Context,
  IMiddleware,
  NextFunction,
} from '@mw-components/share'


/**
 * 设置默认响应 ContentType
 */
@Middleware()
export class ResponseMimeMiddleware implements IMiddleware<Context, NextFunction> {

  static getName(): string {
    const name = 'responseMimeMiddleware'
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

/**
 * 若未通过 `@ContentType(string)` 显式设置头部，则设置默认为 `application/json`
 */
async function middleware(
  ctx: Context,
  next: NextFunction,
): Promise<void> {

  await next()

  const key = 'content-type'
  const mime = ctx.response.headers[key]

  /* c8 ignore next 3 */
  if (! mime) {
    ctx.set(key, 'application/json')
  }
}

