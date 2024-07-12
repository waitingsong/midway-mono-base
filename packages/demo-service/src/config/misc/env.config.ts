import type { SvcHosts } from './env.types.js'


export const svcHosts: SvcHosts = {
  uc: 'http://127.0.0.1:7001',
}
Object.keys(svcHosts).forEach((key) => {
  const name = `SVC_HOST_${key}`
  const value = process.env[name]
  if (process.env[name] && typeof process.env[name] === 'string' && value) {
    svcHosts[key] = value
  }
})

