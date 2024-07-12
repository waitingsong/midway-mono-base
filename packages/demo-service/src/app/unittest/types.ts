/* eslint-disable import/no-extraneous-dependencies */
import type { IncomingHttpHeaders } from 'http'

import type supertest from 'supertest'


export type TestResponse = supertest.Response
export interface TestRespBody {
  header: IncomingHttpHeaders
  url: string
}


