/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import assert from 'node:assert'

import { Init, Inject } from '@midwayjs/decorator'
import { DbManager, Kmore } from '@mw-components/kmore'

import { RootClass } from './root.class'

import { DbReplica } from '~/config/config.types'
import type { DbModel } from '~/config/db.model'
import type { Context } from '~/interface'


export class BaseRepo extends RootClass {

  @Inject() dbManager: DbManager<DbReplica, DbModel, Context>

  protected db: Kmore<DbModel, Context>

  @Init()
  async init(): Promise<void> {
    /* c8 ignore next 3 */
    if (! this.ctx) {
      this.throwError('Value of this.ctx is undefined during Repo init')
    }

    const db = this.dbManager.getDataSource(DbReplica.master)
    assert(db)
    this.db = db
  }

}

