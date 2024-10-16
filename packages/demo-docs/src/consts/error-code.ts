
export class ErrorCode {

  static readonly success = 0
  static readonly E_Common = 1
  /** 身份校验失败 */
  static readonly E_Unauthorized = 401
  /** 资源未找到    */
  static readonly E_Not_Found = 404
  /**
   * 服务内部异常
   * @description 在向外屏蔽内部服务异常时可使用。注意：返回结果将自动屏蔽任何异常详情
   */
  static readonly E_Internal_Server = 500
  /**
   * 服务内部异常
   * @description Knex 连接数据库超时
   */
  static readonly E_Db_Acq_Connection_Timeout = 999
  /**
   * 管理员不存在
   */
  static readonly E_Admin_Not_Exists = 2404
  /**
   * 无效的应用
   * @description 在应用列表中没有对应的 appId 记录
   */
  static readonly E_UC_AppId_Not_Exists = 101001

}
