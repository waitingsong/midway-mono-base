/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import assert from 'node:assert'

import { Init, Inject } from '@midwayjs/core'
import { RootClass } from '@mwcp/boot'
import type { DbTransaction } from '@mwcp/boot'
import { DbManager, Kmore } from '@mwcp/kmore'

import type { DbModel } from '##/config/db/db.model.js'
import { DbReplica } from '##/config/db/db.types.js'


export class BaseRepo extends RootClass {

  @Inject() dbManager: DbManager<DbReplica, DbModel>

  protected db: Kmore<DbModel>

  @Init()
  async baseInit(): Promise<void> {
    const db = this.dbManager.getDataSource(DbReplica.master)
    assert(db)
    this.db = db
  }

  transaction(sourceName: DbReplica): Promise<DbTransaction> {
    const db = this.dbManager.getDataSource(sourceName)
    return db.transaction()
  }

}

