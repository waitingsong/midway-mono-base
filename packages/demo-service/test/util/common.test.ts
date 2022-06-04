import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { retrieveExternalNetWorkInfo } from '~/util/common'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should retrieveExternalNetWorkInfoworks', async () => {
    const infos = retrieveExternalNetWorkInfo()
    assert(Array.isArray(infos) && infos.length >= 1)
  })

})

