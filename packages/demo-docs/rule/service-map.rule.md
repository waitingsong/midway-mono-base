# 服务目录结构

包含服务目录结构规则，文件名格式


## 命名规则

- 01. 无特殊约定或约定俗成时目录名及文件名全部小写
- 02. 文件名以中横线 `-` 为分隔符
- 03. 以 `MVC` 层级或功能作为中缀名
  - **Controller** 为 `.controller` 比如 `user.controller.ts`
  - **Service** 为 `.service` 比如 `user.service.ts`
  - **Model** 为 `.model` 比如 `user.model.ts`
  - **Middleware** 为 `.middleware` 比如 `api.middleware.ts`
  - **UnitTest** 为 `.test` 比如 `user.test.ts`


## 目录结构及文件名

假定服务名为 `uc` 以下步骤基础路径为 `packages/uc/`

- `src/app/` 应用目录，包含服务接口实现
  - `public/` 包含 web 静态资源文件，比如 `js`, `css` 以及 `html`。 web 访问路径为 `/public/`
  - `view/` 包含 `node.js` html 模板文件，详见 `egg.js` 文档
  - `<接口>/` 包含实现单个 http 接口的相关 `Contriller`，`Service`，`Model` 文件
- `src/config/` 网站配置文件目录
- `src/middleware/` web 请求中间件目录
- `test/` 包含单元测试文件

