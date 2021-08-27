import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'

import {
  Context,
  ErrorCode,
  JsonResp,
} from '~/interface'
import MyError from '~/util/my-error'


@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return errHandleMiddleware
  }

}

async function errHandleMiddleware(ctx: Context<unknown>, next: IMidwayWebNext): Promise<void> {
  try {
    await next()
    /* istanbul ignore next */
    if (ctx.status === 404) {
      const { reqId } = ctx
      ctx.body = { code: 404, reqId, msg: 'Not Found' }
    }
  }
  catch (err) {
    // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
    ctx.app.emit('error', err, ctx)

    const myerr = err as MyError

    // 兼容运行ci的时候，assert抛出的错误为AssertionError没有status
    const [message, messageStatus] = myerr.message.split(' &>')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let status: number = typeof myerr.status === 'number'
      ? myerr.status
      /* istanbul ignore next */
      : messageStatus ? parseInt(messageStatus, 10) : 0

    /* istanbul ignore next */
    if (status === 0 || Number.isNaN(status)) {
      status = 500
    }

    /* istanbul ignore else */
    if ((message === 'ValidationError' || myerr.name === 'ValidationError') && status < 600) {
      status = 422
    }

    ctx._internalError = myerr

    // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
    const msg = status === 500 && ctx.app.config.env === 'prod'
      /* istanbul ignore next */
      ? 'Internal Server Error'
      : message

    const { reqId } = ctx

    // 从 error 对象上读出各个属性，设置到响应中
    const body: JsonResp = {
      code: status,
      msg,
      reqId,
    }

    /* istanbul ignore else */
    if (typeof ErrorCode === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof ErrorCode[status] === 'string') {
        // eslint-disable-next-line
        const codeKey = ErrorCode[status] as string
        body.codeKey = codeKey // like 'E_Common'
      }
    }

    /* istanbul ignore else */
    if (status === 422) {
      body.data = myerr.errors ?? myerr.details // 兼容 midway 参数校验
    }

    if (body.code === 500
      && myerr.message.includes('Knex')
      && myerr.message.includes('Timeout acquiring a connection')) {
      body.code = 999 // db error
    }

    ctx.body = body

    // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
    // 100-599为HTTP标准相应代码值
    // 自定义异常的HTTP响应码使用200，通过非零code值来传递业务失败信息
    ctx.status = status >= 100 && status < 600 ? status : 200
  }

  wrapRespForJson(ctx)
}


/**
 * 对于 `application/json` 相应类型，包裹成 JsonResp 格式数据
 */
function wrapRespForJson(ctx: Context<unknown>): void {
  const contentType: string | number | string[] | undefined = ctx.response.header['content-type']
  /* istanbul ignore else */
  if (! contentType || typeof contentType === 'number') {
    return
  }
  else if (typeof contentType === 'string' && ! contentType.includes('application/json')) {
    return
  }
  else if (Array.isArray(contentType) && ! contentType.includes('application/json')) {
    return
  }

  const { status } = ctx
  const body = ctx.body as JsonResp | void

  /* istanbul ignore else */
  if (body && typeof body === 'object' && typeof body.code === 'number') {
    /* istanbul ignore else */
    if (body.code === status) {
      return
    }
    else if (body.code >= 600) {
      return
    }
    else if (typeof body.data !== 'undefined') {
      return
    }
  }

  ctx.body = wrap(ctx, body)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrap(ctx: Context, payload: JsonResp | void): JsonResp {
  /* istanbul ignore else */
  if (ctx.status === 204) {
    ctx.status = 200 // force return JsonResp<T> structure
  }

  const { status, reqId } = ctx
  const body: JsonResp = {
    code: status >= 200 && status < 400 ? 0 : status,
    reqId,
  }

  /* istanbul ignore else */
  if (Array.isArray(payload)) {
    body.data = payload
  }
  else if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
    const { codeKey, ...data } = payload
    /* istanbul ignore else */
    if (typeof data !== 'undefined') {
      body.data = data
    }
    /* istanbul ignore else */
    if (typeof codeKey === 'string') {
      body.codeKey = codeKey
    }
  }
  else if (typeof payload !== 'undefined') {
    body.data = payload
  }

  return body
}

