import { relative } from 'path'

import { retrieveExternalNetWorkInfo } from '~/util/common'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should retrieveExternalNetWorkInfoworks', async () => {
    const infos = retrieveExternalNetWorkInfo()
    assert(Array.isArray(infos) && infos.length >= 1)
  })

})

