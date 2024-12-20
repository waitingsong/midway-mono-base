import {
  Controller,
  Get,
  Inject,
  Param,
  Provide,
} from '@midwayjs/core'

import { BaseController } from '##/interface.js'

import { DebugService } from './debug.service.js'


// CHANGE value for prod!
export const debugPwd = 'debug123456'

@Provide()
@Controller('/debug')
export class DebugController extends BaseController {

  @Inject() readonly svc: DebugService

  @Get('/dump/:id/:hash')
  async heapdump(@Param('id') id: string, @Param('hash') hash: string): Promise<HeapDumpRet | undefined> {
    if (! hash || hash !== debugPwd) {
      this.ctx['status'] = 401
      return
    }


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
      body.path = await this.svc.heapdump()
    }
    else if (pid.toString() === id) {
      body.path = await this.svc.heapdump()
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

