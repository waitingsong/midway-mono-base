/* eslint-disable @typescript-eslint/no-unsafe-call */
// import * as assert from 'assert'

import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'

// import MyError from '~/util/my-error'
import { Context } from '~/interface'


@Provide()
export class JwtAuthMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return jwtAuthMiddleware
  }

}

async function jwtAuthMiddleware(ctx: Context, next: IMidwayWebNext): Promise<void> {

  if (ctx.header.authorization) {
    // const [, token] = ctx.header.authorization.split(' ')
    // 解密，获取payload
    // const { payload } = ctx.app.jwt.decode(token)

    // const { jwtAuth } = ctx.app.config

    // redisToken不存在表示token已过期
    // const redisToken = await ctx.app.redis.get(
    //   `${jwtAuth.redisScope}:accessToken:${payload.id}`,
    // )

    // 验证是否为最新的token
    // assert(token === redisToken, new MyError('Authentication Failed', 401))

    // const userinfo = await ctx.app.redis.get(
    //   `${jwtAuth.redisScope}:userinfo:${payload.id}`,
    // )

    // ctx.currentUser = JSON.parse(userinfo)
  }

  await next()
}

