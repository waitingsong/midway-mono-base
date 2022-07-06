/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import assert from 'node:assert'

import { Init, Inject } from '@midwayjs/decorator'
import { DbManager, Kmore, Knex } from '@mw-components/kmore'

import { RootClass } from './root.class'

import { DbReplica } from '~/config/config.types'
import type { DbModel } from '~/config/db.model'
import type { Context, DbTransaction } from '~/interface'


export class BaseRepo extends RootClass {

  @Inject() dbManager: DbManager<DbReplica, DbModel, Context>

  protected db: Kmore<DbModel, Context>

  @Init()
  async init(): Promise<void> {
    /* c8 ignore next 3 */
    if (! this.ctx) {
      this.throwError('Value of this.ctx is undefined during Repo init')
    }
    if (! this.ctx.dbTransactions || this.ctx.dbTransactions.size) {
      this.ctx.dbTransactions = new Set()
    }

    const db = this.dbManager.getDataSource(DbReplica.master)
    assert(db)
    this.db = db
  }

  /**
   * Start and return a db transacton
   * @description using `this.db.dbh` if param dbhInstance undefined
   */
  async startTransaction(dbhInstance?: Knex): Promise<DbTransaction> {
    const dbh = dbhInstance ?? this.db.dbh
    /* c8 ignore next 3 */
    if (! dbh) {
      this.throwError('dbh undefined', 999)
    }
    try {
      const ret = await dbh.transaction()
      this.ctx.dbTransactions.add(ret)
      return ret
    }
    /* c8 ignore next 4 */
    catch (ex) {
      this.logger.error((ex as Error).message)
      this.throwError('start transaction failed', 999)
    }
  }

}

