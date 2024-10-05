
import type { IncomingHttpHeaders } from 'node:http'

import type supertest from 'supertest'


export type TestResponse = supertest.Response
export interface TestRespBody {
  header: IncomingHttpHeaders
  url: string
}


