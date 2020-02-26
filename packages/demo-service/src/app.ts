/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { EggApplication } from 'midway'


export default (app: EggApplication) => {
  app.beforeStart(async () => {
    console.log('🚀 Your awesome APP is launching...')

    console.log('✅  Your awesome APP launched')
  })
}
