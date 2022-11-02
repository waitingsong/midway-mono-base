import * as base from '@mwcp/boot'
import * as tm from '@mwcp/taskman'


export const useComponents: IComponentInfo[] = [
  base,
  tm,
]

export interface IComponentInfo {
  Configuration: unknown
  [key: string]: unknown
}

