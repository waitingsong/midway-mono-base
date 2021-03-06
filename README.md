# Midway mono repository


[![GitHub tag](https://img.shields.io/github/tag/waitingsong/midway-mono-base.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/badge/lang-TypeScript-blue.svg)]()
[![ci](https://github.com/waitingsong/midway-mono-base/workflows/ci/badge.svg)](https://github.com/waitingsong/midway-mono-base/actions?query=workflow%3A%22ci%22)
[![codecov](https://codecov.io/gh/waitingsong/midway-mono-base/branch/master/graph/badge.svg?token=64mSqC475E)](https://codecov.io/gh/waitingsong/midway-mono-base)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


以下所有命令行操作都在 `git-bash` 窗口中执行

## 创建新项目

### 克隆新项目仓库

```
git clone git@git.foo.com:<group>/<project> && cd <project>
# 比如
git clone git@git.foo.com:foo/uc && cd uc
```

### 初始化仓库

```sh
git archive --remote=git@github.com:waitingsong/midway-mono-base.git HEAD package.json | tar -x > package.json
git add package.json
git commit -m "chore: initialize"
npm run bp:add
git fetch bp -v && git merge bp/master --allow-unrelated-histories -m "Merge remote-tracking branch 'bp/master'"

sh init-project.sh
git remote -v
```

### 根据模板选择初始化子包

#### 创建目录
```sh
# 文档子包
cp -a packages/demo-docs/ packages/docs
# 服务子包
cp -a packages/demo-service/ packages/service
```

#### 更新项目配置

1. 修改**新建**各子包配置文件 `package.json`
   - 选定合适 `@scope` 域名更新 `name` 字段。比如 `@foo/uc-docs` 以及 `@foo/uc-svc`
   - 更新 `private` 值为 `false` 以便能发布 npm 包
   - 更新 service 包的文档依赖。比如，原始 `@scope/docs` 改为 `@foo/uc-docs`
2. 更新各新子包内依赖的文档包名。比如，原始 `@scope/docs` 改为 `@foo/uc-docs`
3. 更新本文档 [Packages](#packages) 表格的子包信息

---





## Packages

NPM scope: `@scope`

| Package     | Version            |
| ----------- | ------------------ |
| [`docs`]    | [文档][docs-ch]    |
| [`service`] | [服务][service-ch] |


## Initialize and install dependencies

run it at first time and any time
```sh
npm run repo:init
```


## Compile

Run under root folder
```sh
npm run build
# specify scope
npm run build @scope/demo-docs
# specify scopes
npm run build @scope/demo-docs @scope/demo-serivce
```


## Update package

```sh
npm run bootstrap
```


## Test

- Use `npm run lint` to check code style.
- Use `npm run test` to run unit test.

## Clan or Purge

```sh
# clean build dist and cache
npm run clean && npm run bootstrap && npm run build
# clean and remove all node_modules
npm run purge && npm run bootstrap && npm run build
```

## Note

- Run `npm run clean` before `npm run build`, if any file under typescript outDir folder was deleted manually.
- Default publish registry is `NPM`, configurated in file `lerna.json`
- Any commands above (such as `npm run build`) running in `Git-Bash` under Windows OS


## Project Documents

- [Wiki](../../wikis/home)


## Freamwork and Plugin Documents

- [Midway]
- [Midway_v2_Docs]
- [Eggjs]


<br>

[Midway]: https://midwayjs.org/midway
[Midway_v2_Docs]: https://www.yuque.com/midwayjs/midway_v2
[Eggjs]: https://eggjs.org


[`docs`]: packages/demo-docs
[docs-ch]: packages/demo-docs/CHANGELOG.md

[`service`]: packages/demo-service
[service-ch]: packages/demo-service/CHANGELOG.md

