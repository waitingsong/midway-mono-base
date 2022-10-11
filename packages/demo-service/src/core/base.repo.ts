/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import assert from 'node:assert'

import { Init, Inject } from '@midwayjs/decorator'
import type { Context, DbTransaction } from '@mwcp/base'
import { DbManager, Kmore } from '@mwcp/kmore'

import { RootClass } from './root.class'

import { DbReplica } from '~/config/config.types'
import type { DbModel } from '~/config/db.model'


export class BaseRepo extends RootClass {

  @Inject() dbManager: DbManager<DbReplica, DbModel, Context>

  protected db: Kmore<DbModel, Context>

  @Init()
  async baseInit(): Promise<void> {
    /* c8 ignore next 3 */
    if (! this.ctx) {
      this.throwError('Value of this.ctx is undefined during Repo init')
    }

    const db = this.dbManager.getDataSource(DbReplica.master)
    assert(db)
    this.db = db
  }

  transaction(sourceName: DbReplica): Promise<DbTransaction> {
    const db = this.dbManager.getDataSource(sourceName)
    return db.transaction()
  }

}

