/* eslint-disable import/no-extraneous-dependencies */
import { IncomingHttpHeaders } from 'http'

import supertest from 'supertest'


export type TestResponse = supertest.Response
export interface TestRespBody {
  header: IncomingHttpHeaders
  url: string
}


