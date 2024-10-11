# Midway mono repository


[![GitHub tag](https://img.shields.io/github/tag/waitingsong/midway-mono-base.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/badge/lang-TypeScript-blue.svg)]()
[![ci](https://github.com/waitingsong/midway-mono-base/actions/workflows/nodejs.yml/badge.svg
)](https://github.com/waitingsong/midway-mono-base/actions)
[![codecov](https://codecov.io/gh/waitingsong/midway-mono-base/branch/main/graph/badge.svg?token=64mSqC475E)](https://codecov.io/gh/waitingsong/midway-mono-base)


## Install global deps for development
```sh
npm i -g c8 lerna madge rollup tsx zx
```


## Packages


## Project Documents

- [Wiki](../../wikis/home)
- [Tips](./Tips.md)


NPM scope: `@scope`

| Package     | Version            |
| ----------- | ------------------ |
| [`docs`]    | [文档][docs-ch]    |
| [`service`] | [服务][service-ch] |


## Swagger API docs and tests
```sh
cd packages/foo-pos-svc
npm run dev
```

Open location:
```
http://localhost:7001/swagger-ui/index.html
```


## Framework and Plugin Documents

- [Midway]
- [Knex]
- [Kmore]
- [node-pg-native]


<br>

[Midway]: https://midwayjs.org/midway
[Knex]: https://knexjs.org/
[Kmore]: https://github.com/waitingsong/kmore
[node-pg-native]: https://github.com/brianc/node-pg-native


[`docs`]: packages/demo-docs
[docs-ch]: packages/demo-docs/CHANGELOG.md

[`service`]: packages/demo-service
[service-ch]: packages/demo-service/CHANGELOG.md

