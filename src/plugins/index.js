/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins - доп функциональность, которая исп-ся в приложении
import vuetify from './vuetify'
import router from '@/router'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
}
