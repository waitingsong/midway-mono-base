import { IMidwayWebApplication } from '@midwayjs/web'
import supertest, { SuperTest } from 'supertest'


export interface TestConfig {
  app: IMidwayWebApplication
  httpRequest: SuperTest<supertest.Test>
  // svc: TaskQueueService
}
export const testConfig = {
} as TestConfig

