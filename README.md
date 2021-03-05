# Midway mono repository


[![GitHub tag](https://img.shields.io/github/tag/waitingsong/midway-mono-base.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/badge/lang-TypeScript-blue.svg)]()
[![ci](https://github.com/waitingsong/midway-mono-base/workflows/ci/badge.svg)](https://github.com/waitingsong/midway-mono-base/actions?query=workflow%3A%22ci%22)
[![codecov](https://codecov.io/gh/waitingsong/midway-mono-base/branch/master/graph/badge.svg?token=64mSqC475E)](https://codecov.io/gh/waitingsong/midway-mono-base)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


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

