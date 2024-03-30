
/** UC 应用列表 */
export class TbAppDO {

  app_id: number
  app_name: string
  app_url: string
  app_valid: number
  app_authkey: string
  allow_ips: string[]
  ctime: Date
  mtime: Date | null

}

