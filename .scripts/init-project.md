
## 安装全局依赖
```sh
npm i -g c8 lerna madge rollup tsx zx
```

## 创建新项目

### 克隆新项目仓库

```sh
git clone git@git.foo.com:<group>/<project> && cd <project>
# 比如
git clone git@git.foo.com:foo/uc && cd uc
```

### 初始化仓库

```sh
# git (GitHub not support)
git archive --remote=git@github.com:waitingsong/midway-mono-base.git HEAD package.json | tar -x > package.json
# https
curl -kL https://github.com/waitingsong/midway-mono-base/raw/main/package.json > package.json

git add package.json
git commit -m "chore: initialize"
npm run bp:add
git fetch bp -v && git merge bp/main --allow-unrelated-histories -m "Merge remote-tracking branch 'bp/main'"

# 手动指定项目名（仅作为代码库标识用途），包名可使用下划线分隔（不能使用减号-）
sh init-project.sh @scope/foo
# 自动使用目录名作为项目名（仅作为代码库标识用途）
sh init-project.sh

# 初始化依赖
npm install
```

### 根据模板选择初始化子包

#### 创建目录
```sh
# TypeScript 类型子包（前后端可以共用）
npm run add:types @scope/types
# 服务子包（生成完毕之后需要手工替换 src/ 源码中对于 `@scope/docs` 模块的引用）
npm run add:svc @scope/svc
```

#### 更新项目配置

1. 更新仓库顶级 `package.json` 文件 `description` 等字段
2. 修改**新建**各子包配置文件 `package.json`
3. 更新本文档 [Packages](#packages) 表格的子包信息


## Compile

Run under root folder
```sh
npm run build
# specify scope
npm run build @scope/demo-docs
# specify scopes
npm run build @scope/demo-docs @scope/demo-serivce
```

## Add dependencies

```sh
lerna add pkg-name --scope=@scope/demo-service
```

## Update package

```sh
npm i
```


## Add package

```sh
# TypeScript 类型子包（前后端可以共用）
npm run add:types @scope/types
# 服务子包（生成完毕之后需要手工替换 src/ 源码中对于 `@scope/types` 模块的引用）
npm run add:svc @foo-pos/svc
```

## Test

- Use `npm run lint` to check code style.
- Use `npm run test` to run unit test.

## Clan or Purge

```sh
# clean build dist, cache and build
npm run clean
# clean and remove all node_modules, install deps and build
npm run purge
```

## Swagger API docs and tests
```sh
cd packages/foo-pos-svc
npm run dev
```

Open location:
```
http://localhost:7001/swagger-ui/index.html
```

## Note

- Default publish registry is `NPM`, configurated in file `lerna.json`
- Any commands above (such as `npm run build`) running in `Git-Bash` under Windows OS
- Default response MIME type is `application/json` via  `config.middleware` and `response-mime.middleware.ts`


