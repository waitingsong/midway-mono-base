import { genDbDict } from 'kmore-types'

import type { DbModel } from './db.model.js'


export const dbDict = genDbDict<DbModel>()

