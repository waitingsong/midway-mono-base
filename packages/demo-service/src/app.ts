/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { EggApplication } from 'midway'


export default (app: EggApplication) => {
  app.beforeStart(async () => {
    console.log('🚀 Your awesome APP is launching...')

    const { pkg } = app.config
    console.info({
      pkgName: pkg.name,
      pkgVersion: pkg.version,
    })

    console.log('✅  Your awesome APP launched')
  })
}
