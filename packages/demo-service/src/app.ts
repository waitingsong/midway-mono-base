/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { EggApplication } from 'midway'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (app: EggApplication): void => {
  app.beforeStart((): void => {
    console.log('🚀 Your awesome APP is launching...')

    const { pkg } = app.config
    console.info({
      pkgName: pkg.name,
      pkgVersion: pkg.version,
    })

    console.log('✅  Your awesome APP launched')
  })
}
