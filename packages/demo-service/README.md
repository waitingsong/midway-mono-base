# midway-demo-service

demo-service 模板


## Development

```sh
npm run dev
```

Open url and refreseh page:
- http://localhost:7001/
- http://localhost:7001/ip
- http://localhost:7001/token
- http://localhost:7001/test_sign


## Deploy

```bash
npm run clean && npm run build
npm start
npm stop
```


## Test

- Use `npm run lint` to check code style.
- Use `npm run test:local` to run unit test (under sub package).


## Note

- Run `npm run clean` before `npm run build`, if any file under typescript outDir folder was deleted manually.
- Remove `scripts.postinstall` in `packages.json` instead with real api pkg name and npm path in `dependencies`


## Document and Plugins

- [Midway]
- [Knex]
- [Kmore]
- [node-pg-native]


[Midway]: https://midwayjs.org/midway
[Knex]: https://knexjs.org/
[Kmore]: https://github.com/waitingsong/kmore
[node-pg-native]: https://github.com/brianc/node-pg-native

