import { RxRequestInit } from '@waiting/egg-fetch'

import { RootClass } from './root.class'


export class BaseController extends RootClass {

  /**
   * Generate an RxRequestInit variable,
   * with dataType: 'json'
   */
  get initFetchArgs(): RxRequestInit {
    const args: RxRequestInit = {
      dataType: 'json',
    }
    return args
  }

}

