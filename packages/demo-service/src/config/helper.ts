import { Context } from '~/interface'


// see: test/app/home/home.test.ts
export async function testJumpTo(ctx: Context): Promise<string | false> {
  return ctx.method === 'GET' && ctx.path === '/test_passthrough_redirect'
    ? '/test_passthrough_redirect_path'
    : false
}

