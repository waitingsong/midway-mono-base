import { Init } from '@midwayjs/decorator'
import {
  DbManager,
  Kmore,
  unsubscribeEventFuncOnResFinish,
} from '@mw-components/kmore'

import { RootClass } from './root.class'

import { DbReplica, DbReplicaKeys } from '~/config/config.types'
import { DbModel } from '~/config/db.model'


export class BaseRepo extends RootClass {

  protected db: Kmore<DbModel>

  @Init()
  async init(): Promise<void> {
    const container = this.app.getApplicationContext()
    const dbManager = await container.getAsync(DbManager) as DbManager<DbReplicaKeys>
    this.db = await dbManager.create<DbModel>(this.ctx, DbReplica.master, unsubscribeEventFuncOnResFinish)
  }

}

