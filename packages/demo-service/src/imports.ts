import * as swagger from '@midwayjs/swagger'
import * as boot from '@mwcp/boot'
// import * as taskman from '@mwcp/taskman'


export const useComponents: IComponentInfo[] = [
  boot,
  // swagger,
  // taskman,
]

/* c8 ignore next 4 */
const CI = !! (process.env['MIDWAY_SERVER_ENV'] === 'unittest'
  || process.env['MIDWAY_SERVER_ENV'] === 'local'
  || process.env['NODE_ENV'] === 'unittest'
  || process.env['NODE_ENV'] === 'local'
)
if (CI) {
  useComponents.push(swagger)
}

export interface IComponentInfo {
  Configuration: unknown
  [key: string]: unknown
}

