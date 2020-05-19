// details: https://github.com/nuxt-community/vuetify-module

import colors from 'vuetify/es5/util/colors'
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'

export default {
  breakpoint: {},
  icons: {},
  lang: {
    locales: {
      en, ru
    },
    current: 'ru'
  },
  rtl: false,
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
}
