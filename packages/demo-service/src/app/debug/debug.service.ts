import { Provide } from '@midwayjs/decorator'

import { BaseService } from '~/interface'
import { createHeapSnapshot } from '~/util/memory'


@Provide()
export class DebugService extends BaseService {

  heapdump(): string {
    const dir = './run/dump'
    const ret = createHeapSnapshot(dir)
    return ret
  }

}

