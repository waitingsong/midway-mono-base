/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Init } from '@midwayjs/decorator'
import {
  DbManager,
  Kmore,
  Knex,
  unsubscribeEventFuncOnResFinish,
} from '@mw-components/kmore'

import { RootClass } from './root.class'

import { DbReplica, DbReplicaKeys } from '~/config/config.types'
import { DbModel } from '~/config/db.model'
import { DbTransaction } from '~/interface'


export class BaseRepo extends RootClass {

  protected db: Kmore<DbModel>

  @Init()
  async init(): Promise<void> {
    if (! this.ctx) {
      this.throwError('Value of this.ctx is undefined during Repo init')
    }
    if (! this.ctx.dbTransactions || this.ctx.dbTransactions.size) {
      this.ctx.dbTransactions = new Set()
    }

    const container = this.app.getApplicationContext()
    const dbManager = await container.getAsync(DbManager) as DbManager<DbReplicaKeys>
    this.db = await dbManager.create<DbModel>(this.ctx, DbReplica.master, unsubscribeEventFuncOnResFinish)
  }

  /**
   * Start and return a db transacton
   * @description using `this.db.dbh` if param dbhInstance undefined
   */
  async startTransaction(dbhInstance?: Knex): Promise<DbTransaction> {
    const dbh = dbhInstance ?? this.db.dbh
    if (! dbh) {
      this.throwError('dbh undefined', 999)
    }
    try {
      const ret = await dbh.transaction()
      this.ctx.dbTransactions.add(ret)
      return ret
    }
    catch (ex) {
      this.logger.error((ex as Error).message)
      this.throwError('start transaction failed', 999)
    }
  }

}

