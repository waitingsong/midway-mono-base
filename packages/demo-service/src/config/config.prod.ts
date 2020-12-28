import { SvcHosts } from './config.types'


export {
  jwt,
  kmore,
  koid,
} from './helper'

export const svcHosts: SvcHosts = {
  uc: 'http://127.0.0.1:7001',
}
Object.keys(svcHosts).forEach((key) => {
  const name = `SVC_HOST_${key}`
  if (typeof process.env[name] === 'string') {
    svcHosts[key] = process.env[name] as string
  }
})
// eslint-disable-next-line no-console
// console.log('svcHosts:', svcHosts)

