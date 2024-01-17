# Tips

## 注意事项

- 本项目范围内需要的类型在项目类型依赖子包（比如 `@scope/types` ）中定义并导出
- 类型子包中更新枚举/类属性后需要重新编译才能被同仓库其它子包感知
- 本项目服务工程子包使用的类型若存在于项目类型依赖子包（比如 `@scope/types` ）则统一在 `src/types.ts` 文件中导入和导出  
  使用方式 `import { Foo } from '##/interface.js'`


## 常用功能

- 链路追踪日志
  - 方法：`this.logger.info|warn|error|debug()`
  - 范围：任何业务类方法
- HTTP GET JSON 请求
  - 方法：`this.getJson<T>()`
  - 范围：`Controller`, `Service`
  - 备注：请求结果为 `json` 格式
- HTTP POST JSON 请求
  - 方法：`this.postJson<T>()`
  - 范围：`Controller`, `Service`
  - 备注：请求参数及结果都为 `json` 格式
- HTTP GET TEXT 请求
  - 方法：`this.getText()`
  - 范围：`Controller`, `Service`
  - 备注：请求结果为 string 数据
- 雪花算法
  - 方法：`this.idGenerator`
  - 范围：任何业务类方法

