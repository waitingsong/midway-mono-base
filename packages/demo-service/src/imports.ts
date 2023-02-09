import * as boot from '@mwcp/boot'
import * as tm from '@mwcp/taskman'


export const useComponents: IComponentInfo[] = [
  boot,
  tm,
]

export interface IComponentInfo {
  Configuration: unknown
  [key: string]: unknown
}

