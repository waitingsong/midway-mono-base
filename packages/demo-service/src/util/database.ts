import { Context } from '~/interface'


/**
 * Rollback all uncommitted transaction stored on ctx.dbTransactions
 */
export async function rollbackAndCleanCtxTransactions(ctx: Context): Promise<void> {
  const pms: Promise<unknown>[] = []

  if (! ctx.dbTransactions.size) {
    return
  }

  ctx.dbTransactions.forEach((trx) => {
    if (! trx.isTransaction) {
      return
    }
    else if (trx.isCompleted()) {
      return
    }

    ctx.logger.warn('Manaual rollback transaction before request end')
    const pm = trx.rollback().then()
    pms.push(pm)
  })

  const arr = await Promise.allSettled(pms)
  arr.forEach((res) => {
    if (res.status === 'rejected') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const ex = res.reason
      ctx.logger.error('trx rollback failed', ex)
    }
  })

  ctx.dbTransactions.clear()
}

