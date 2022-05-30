import {
  Controller,
  Get,
  Inject,
  Param,
  Provide,
} from '@midwayjs/decorator'

import { DebugService } from './debug.service'

import { BaseController } from '~/interface'


// CHANGE value for prod!
export const debugPwd = 'debug123456'


@Provide()
@Controller('/debug')
export class DebugController extends BaseController {

  @Inject() readonly svc: DebugService

  @Get('/dump/:id/:hash')
  async heapdump(@Param('id') id: string, @Param('hash') hash: string): Promise<HeapDumpRet | void> {
    if (! hash || hash !== debugPwd) {
      this.ctx.status = 401
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (debugPwd + '' === 'debug123456') {
      this.logger.warn('Value of DebugController.pwd should be update for prod')
    }

    const { pid, ppid } = process
    const body: HeapDumpRet = {
      ppid,
      pid,
      path: '',
      costSec: 0,
    }

    const start = Date.now()
    if (id === '0') {
      void 0
    }
    else if (id === '1') {
      body.path = this.svc.heapdump()
    }
    else if (pid.toString() === id) {
      body.path = this.svc.heapdump()
    }
    else {
      void 0
    }
    const delta = Date.now() - start
    body.costSec = delta

    return body
  }

}


export interface HeapDumpRet {
  ppid: number
  pid: number
  path: string
  costSec: number
}

