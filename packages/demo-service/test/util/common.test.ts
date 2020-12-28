/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { basename, join } from '@waiting/shared-core'

import { retrieveExternalNetWorkInfo } from '~/util/common'


const assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  it('should retrieveExternalNetWorkInfoworks', async () => {
    const infos = retrieveExternalNetWorkInfo()
    assert(Array.isArray(infos) && infos.length >= 1)
  })

})

