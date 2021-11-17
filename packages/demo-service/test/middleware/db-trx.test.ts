import { relative } from 'path'

import { testConfig } from '@/root.config'
import { UserRepo } from '~/app/user/user.repo'
import { DbTrxMiddleware } from '~/middleware/db-trx.middleware'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  describe('should work', () => {
    it('empty set', async () => {
      const { app, next } = testConfig
      const ctx = app.createAnonymousContext()
      assert(typeof ctx.dbTransactions === 'undefined')

      ctx.status = 200
      const inst = await ctx.requestContext.getAsync(DbTrxMiddleware)
      const mw = inst.resolve()
      // @ts-ignore
      await mw(ctx, next)

      assert(ctx.dbTransactions.size === 0)
    })

    it('rollback', async () => {
      const { app, next } = testConfig
      const ctx = app.createAnonymousContext()
      assert(typeof ctx.dbTransactions === 'undefined')

      const repo = await ctx.requestContext.getAsync(UserRepo)
      const { dbTransactions } = ctx
      assert(dbTransactions.size === 0)

      const inst = await ctx.requestContext.getAsync(DbTrxMiddleware)

      await repo.startTransaction()
      assert(dbTransactions.size === 1)
      await repo.startTransaction()
      assert(dbTransactions.size === 2)

      ctx.status = 200
      const mw = inst.resolve()
      // @ts-ignore
      await mw(ctx, next)

      assert(dbTransactions.size === 0)
    })

  })
})

