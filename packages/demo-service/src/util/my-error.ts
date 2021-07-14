/**
 * 全局自定义错误结构
 * 可以接受多条错误信息，用于业务抛错
 */
export default class MyError extends Error {

  status: number

  errors: unknown[] | undefined

  details?: unknown

  /**
   * 抛出异常，默认状态值 500
   */
  constructor(message: string, status = 500, errors?: unknown[]) {
    super(message + ` &>${status}`) // 兼容ci测试时，assert无法自定义增加status
    this.status = status
    this.errors = errors
  }

}

