import { IncomingHttpHeaders } from 'http'

import { JwtComponent } from '@mw-components/jwt'
import supertest, { SuperTest } from 'supertest'

import {
  Application,
  IMidwayContainer,
  NpmPkg,
} from '~/interface'


export type TestResponse = supertest.Response
export interface TestRespBody {
  header: IncomingHttpHeaders
  url: string
}

export interface TestConfig {
  app: Application
  container: IMidwayContainer
  httpRequest: SuperTest<supertest.Test>
  host: string
  jwt: JwtComponent
  pkg: NpmPkg
  token: string
}
const jwt = `
Bearer
eyJhbGciOiJIUzI1NiJ9.eyJ
`

export const testConfig = {
  host: '',
  token: jwt.trim().replace(/\n/ug, ' '),
} as TestConfig

