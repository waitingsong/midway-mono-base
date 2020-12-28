
export enum ErrorCode {
  success = 0,
  E_Common = 1,
  /** 身份校验失败 */
  E_Unauthorized = 401,
  /** 资源未找到    */
  E_Not_Found = 404,
  /**
   * 服务内部异常
   * @description 在向外屏蔽内部服务异常时可使用。注意：返回结果将自动屏蔽任何异常详情
   */
  E_Internal_Server = 500,
  /** 参数数量不正确 */
  E_Valid_Param_Number = 2001,
  /** 参数类型不正确 */
  E_Valid_Param_Type = 2002,

  /** 参数格式不正确 */
  E_Valid_Param_Format = 2003,
  /** 字符串长度不满足规则  */
  E_Valid_Str_Length = 2004,
  /**
   * 无效的应用
   * @description 在应用列表中没有对应的 appId 记录
   */
  E_UC_AppId_Not_Exists = 101001,
}

