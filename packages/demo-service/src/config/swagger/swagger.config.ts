import type { RouterOption } from '@midwayjs/core'


export const swagger = {
  routerFilter: (url: string, options: RouterOption) => {
    void options
    if (url.startsWith('/_')) {
      return true
    }
  },
}

