import { IncomingHttpHeaders } from 'node:http'
import { join } from 'node:path'

import {
  Application,
  IMidwayContainer,
  JsonResp,
  NpmPkg,
  ValidateService,
} from '@mwcp/boot'
import { JwtComponent } from '@mwcp/jwt'
import { genCurrentDirname } from '@waiting/shared-core'
import supertest, { SuperTest } from 'supertest'


export const testDir = genCurrentDirname(import.meta.url)
export const baseDir = join(testDir, '..')

export const CI = !! (process.env['CI']
  || process.env['MIDWAY_SERVER_ENV'] === 'unittest'
  || process.env['MIDWAY_SERVER_ENV'] === 'local'
  || process.env['NODE_ENV'] === 'unittest'
  || process.env['NODE_ENV'] === 'local'
)

export type TestResponse = supertest.Response
export type TestRespBody = JsonResp<RespData>
export interface RespData {
  header: IncomingHttpHeaders
  url: string
  cookies: unknown
}

export interface TestConfig {
  baseDir: string
  testDir: string
  testAppDir: string
  CI: boolean
  app: Application
  container: IMidwayContainer
  validateService: ValidateService
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

const testAppDir = join(testDir, 'fixtures', 'base-app')
export const testConfig = {
  baseDir,
  testDir,
  testAppDir,
  CI,
  host: '',
  httpRequest: {},
  token: jwt.trim().replace(/\n/ug, ' '),
} as TestConfig

