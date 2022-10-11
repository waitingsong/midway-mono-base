import assert from 'node:assert/strict'
import { relative } from 'node:path'

import { createHttpRequest } from '@midwayjs/mock'
import type { JsonResp } from '@mwcp/base'
import {
  ClientURL,
  ServerURL,
  CreateTaskDTO,
  TaskDTO,
  TaskFullDTO,
  initTaskDTO,
  AgentController,
} from '@mwcp/taskman'

import { testConfig } from '@/root.config'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it(ClientURL.hello, async () => {
    const { app } = testConfig
    const container = app.getApplicationContext()
    try {
      await container.getAsync(AgentController)
    }
    catch (ex) {
      console.info('skip test due to instance of AgentController undefined')
      return
    }

    const url = `${ClientURL.base}/${ClientURL.hello}`
    const res = await createHttpRequest(app)
      .get(url)

    assert(res.status === 200)
    assert(res.text === 'OK')
  })

  it(ServerURL.create, async () => {
    const { app } = testConfig
    const container = app.getApplicationContext()
    try {
      await container.getAsync(AgentController)
    }
    catch (ex) {
      console.info('skip test due to instance of AgentController undefined')
      return
    }

    const input: CreateTaskDTO = {
      json: {
        url: `http://localhost:7001${ServerURL.base}/${ServerURL.hello}`,
        method: 'GET',
        headers: {
          f2: Math.random().toString(),
        },
        data: {
          tid: 1,
          time: new Date().toUTCString(),
        },
      },
    }
    const url = `${ServerURL.base}/${ServerURL.create}`
    const res = await createHttpRequest(app)
      .post(url)
      .send(input)

    assert(res.status === 200)
    const body = res.body as JsonResp<TaskDTO>
    valiateTask(body.data)
  })

})

export function valiateTask(task: TaskDTO): void {
  assert(Object.keys(task).length > 0)
  assert(typeof task.taskId === 'string' && task.taskId)
  const id = BigInt(task.taskId)
  assert(id > 0)

  assert(typeof (task as TaskFullDTO).json === 'undefined', JSON.stringify(task))

  assert(task.taskState === initTaskDTO.taskState)
  assert(task.isTimeout === false, JSON.stringify(task))
  assert(task.startedAt === null, JSON.stringify(task))
  // assert(task.willStart instanceof Date, JSON.stringify(task))
  // assert(task.ctime instanceof Date, JSON.stringify(task))
  assert(task.mtime === null, JSON.stringify(task))
}

