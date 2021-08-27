import { relative } from 'path'

import { createHttpRequest } from '@midwayjs/mock'
import {
  ServerAgent,
  CreateTaskDTO,
  TaskDTO,
  TaskFullDTO,
  initTaskDTO,
  TaskAgentController,
} from '@mw-components/taskman'

import { testConfig } from '../../root.config'

import { JsonResp } from '~/interface'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it(ServerAgent.hello, async () => {
    const { app } = testConfig
    const container = app.getApplicationContext()
    try {
      await container.getAsync(TaskAgentController)
    }
    catch (ex) {
      console.info('skip test due to instance of TaskAgentController undefined')
      return
    }

    const url = `${ServerAgent.base}/${ServerAgent.hello}`
    const res = await createHttpRequest(app)
      .get(url)

    assert(res.status === 200)
    assert(res.text === 'OK')
  })

  it(ServerAgent.create, async () => {
    const { app } = testConfig
    const container = app.getApplicationContext()
    try {
      await container.getAsync(TaskAgentController)
    }
    catch (ex) {
      console.info('skip test due to instance of TaskAgentController undefined')
      return
    }

    const input: CreateTaskDTO = {
      json: {
        url: `http://localhost:7001${ServerAgent.base}/${ServerAgent.hello}`,
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
    const url = `${ServerAgent.base}/${ServerAgent.create}`
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

