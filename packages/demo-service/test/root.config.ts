import { IncomingHttpHeaders } from 'node:http'

import { JwtComponent } from '@mw-components/jwt'
import supertest, { SuperTest } from 'supertest'

import {
  Application,
  IMidwayContainer,
  NpmPkg,
} from '~/interface'


const CI = !! process.env.CI
export type TestResponse = supertest.Response
export interface TestRespBody {
  header: IncomingHttpHeaders
  url: string
}

export interface TestConfig {
  CI: boolean
  app: Application
  container: IMidwayContainer
  host: string
  httpRequest: SuperTest<supertest.Test>
  jwt: JwtComponent
  pkg: NpmPkg
  token: string
}
const jwt = `
Bearer
eyJhbGciOiJIUzI1NiJ9.eyJ
`

export const testConfig = {
  CI,
  host: '',
  token: jwt.trim().replace(/\n/ug, ' '),
} as TestConfig

