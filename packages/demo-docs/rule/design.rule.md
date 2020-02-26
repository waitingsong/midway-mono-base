# 开发流程

项目开发流程


## 准备阶段

- 01. 克隆项目库，假定名为 proj
- 02. 执行命令 `npm run repo:init` 安装相关依赖
- 03. 阅读 `package/docs/README.md` 文档了解相关规则、约定、术语


## 服务设计阶段

以目录 `packages/docs/src/` 作为以下步骤相对路径的基础目录

- 01. 创建服务名称目录，比如用户中心服务 `uc/`
- 02. 创建 `uc/design/index.md` 文档并更新设计，相关图片、媒体资源保存在 `assets/` 目录下
- 03. 创建 `uc/db/` 目录保存数据库设计
  - `index.md` 表结构设计
  - `ddl/` 目录保存建表 `sql` 脚本文件，每个文件对应一个表
- 04. 创建 `uc/api/` 目录，编写服务 http 接口设计文档。每个文件对应一个接口
- 05. 创建 `uc/model/` 目录编写服务设计数据库、接口模型
  - `database.model.ts` 文件包含本服务关联库表结构模型
  - `<接口>.model.ts` 文件为接口的请求、返回数据模型
  - `index.ts` 集中导出本目录下所有模型
- 06. 更新 `packages/docs/src/index.ts` 文件引入并导出本服务相关模型
  - 引入路径为 `./uc/model/index`
  - 引入为 `namespace` 命名空间，名称格式为 `<服务名>Model` 比如 `UcModel`、`OaModel`
  - 导出此命名空间类型


## 名词含义

- `项目库`: `GIT` 管理的某个项目代码库
- `提交`: `GIT` 版本提交 `commit`
- `依赖`: `js` 第三方工具包
