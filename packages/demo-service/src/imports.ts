import * as boot from '@mwcp/boot'
// import * as taskman from '@mwcp/taskman'


export const useComponents: IComponentInfo[] = [
  boot,
  // taskman,
]

export interface IComponentInfo {
  Configuration: unknown
  [key: string]: unknown
}

