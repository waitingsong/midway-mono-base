// eslint-disable-next-line import/no-extraneous-dependencies
import { IMidwayLogger, MidwayContextLogger, MidwayTransformableInfo } from '@midwayjs/logger'

import type { Application, Context } from '~/interface'
import { genISO8601String } from '~/util/ext'


class CustomContextLogger extends MidwayContextLogger<Context> {
  // @ts-ignore
  formatContextLabel() {
    const { ctx } = this
    // format: '[$userId/$ip/$traceId/$use_ms $method $url]'
    const userId = (ctx['userId'] as string) || '-'
    const traceId = ctx.reqId || '-'
    const use = Date.now() - ctx.startTime
    const ret = userId
      + '/'
      + ctx.ip
      + '/'
      + traceId
      + '/'
      + use.toString()
      + 'ms '
      + ctx.method
      + ' '
      + ctx.url

    return ret
  }
}

export function customLogger(logger: IMidwayLogger, app: Application): void {
  // 格式化日志时间戳
  logger.updateTransformableInfo(updateTransformableInfo)
  // 上下文日志打印请求id
  app.setContextLoggerClass(CustomContextLogger)
}

export function updateTransformableInfo(info: MidwayTransformableInfo): MidwayTransformableInfo {
  const ret = {
    ...info,
    timestamp: genISO8601String(),
  }
  return ret
}


