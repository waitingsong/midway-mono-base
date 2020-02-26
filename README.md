# Midway mono repository


[![pipeline status](https://gitlab.foo.com/your-group/apps/badges/master/pipeline.svg)](https://gitlab.foo.com/your-group/apps/commits/master)
[![GitHub tag](https://img.shields.io/github/tag/waitingsong/midway-mono-base.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/badge/lang-TypeScript-blue.svg)]()
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


## Packages

NPM scope: `@scope`

| Package     | Version                      |
| ----------- | ---------------------------- |
| [`docs`]    | [![docs-svg]][docs-ch]       |
| [`service`] | [![service-svg]][service-ch] |


## Initialize

```sh
npm run repo:init
```


## Compile

```sh
npm run build
```


## Update package

```sh
npm run bootstrap
```


## Test

- Use `npm run lint` to check code style.
- Use `npm run test` to run unit test.


## Note

- Run `npm run clean` before `npm run build`, if any file under typescript outDir folder was deleted manually.
- Default publish registry is `NPM`, configurated in file `lerna.json`


## Global Documents

- [文档目录结构](packages/demo-docs/rule/docs-map.rule.md)
- [服务目录结构](packages/demo-docs/rule/service-map.rule.md)
- [数据库设计](packages/demo-docs/rule/db.rule.md)
- [服务设计](packages/demo-docs/rule/design.rule.md)


## Project Documents

- [docs](packages/docs/)


## Freamwork and Plugin Documents

- [Midway]
- [Eggjs]
- [egg-fetch]
- [egg-jwt]
- [egg-kmore]


[Midway]: https://midwayjs.org/midway
[Eggjs]: https://eggjs.org
[egg-fetch]: https://github.com/waitingsong/egg-fetch
[egg-jwt]: https://github.com/waitingsong/egg-jwt
[egg-kmore]: https://github.com/waitingsong/egg-kmore


[`docs`]: https://github.com/waitingsong/midway-mono-base/tree/master/packages/demo-docs
[docs-svg]: https://img.shields.io/npm/v/kmore-types.svg?cacheSeconds=86400
[docs-ch]: https://github.com/waitingsong/midway-mono-base/tree/master/packages/demo-docs/CHANGELOG.md

[`service`]: https://github.com/waitingsong/midway-mono-base/tree/master/packages/demo-service
[service-svg]: https://img.shields.io/npm/v/kmore.svg?cacheSeconds=86400
[service-ch]: https://github.com/waitingsong/midway-mono-base/tree/master/packages/demo-service/CHANGELOG.md

