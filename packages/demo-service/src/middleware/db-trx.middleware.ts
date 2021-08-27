import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext, MidwayWebMiddleware } from '@midwayjs/web'

import { Context } from '~/interface'
import { rollbackAndCleanCtxTransactions } from '~/util/database'


@Provide()
export class DbTrxMiddleware implements IWebMiddleware {

  resolve(): MidwayWebMiddleware {
    return dbTrxMiddleware
  }

}

/**
 * Rollback all uncommitted transaction stored on ctx.dbTransactions
 */
async function dbTrxMiddleware(ctx: Context, next: IMidwayWebNext): Promise<void> {
  if (typeof ctx.dbTransactions === 'undefined') {
    ctx.dbTransactions = new Set()
  }

  try {
    await next()
  }
  finally {
    await rollbackAndCleanCtxTransactions(ctx)
  }
}

