import colors from 'vuetify/es5/util/colors'
require('dotenv').config() // load env for true app configuration (axios and other) FIXME https://github.com/nuxt-community/axios-module/issues/171#issuecomment-542261530

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `${titleChunk} – ${process.env.APP_NAME}` : process.env.APP_NAME
    },
    title: process.env.APP_NAME || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: colors.blue.darken2 },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/page-transition.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/vuelidate', ssr: false },
    { src: '~plugins/data-schema' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://auth.nuxtjs.org/
    // '@nuxtjs/auth'
    '@nuxtjs/auth-next'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/api/options.html
  */
  auth: {
    strategies: {
      laravelPassportPasswordGrant: {
        name: 'laravelPassportPassword',
        provider: 'laravel/passport',
        url: process.env.AUTH_BASE_URL || 'http://food-service.local',
        endpoints: {
          user: {
            url: process.env.AUTH_USER_ENDPOINT || '/api/auth/user'
          }
        },
        token: {
          maxAge: 1800
        },
        refreshToken: {
          maxAge: 60 * 60 * 24 * 30
        },
        clientId: process.env.AUTH_PASSPORT_CLIENT_ID,
        clientSecret: process.env.AUTH_PASSPORT_CLIENT_SECRET,
        grantType: 'password'
      }
    }
  },

  router: {
    middleware: ['auth']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    optionsPath: './vuetify.options.js'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
