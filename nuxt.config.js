const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    name: 'chasing-dots',
    color: '#009790',
    height: '3px'
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
    '~/assets/css/tachyons.css',
    'bootstrap/dist/css/bootstrap-grid.min.css',
    'vue-multiselect/dist/vue-multiselect.min.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/components-registration',
    '~plugins/filters.js',
    { src: '~/plugins/font-awesome', ssr: false },
    '~/plugins/vue-js-modal',
    { src: '~/plugins/vue-socket-io', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    [
      'nuxt-validate',
      {
        lang: 'fr',
        classes: true,
        classNames: {
          touched: '--touched', // the control has been blurred
          untouched: '--untouched', // the control hasn't been blurred
          valid: '--valid', // model is valid
          invalid: '--invalid', // model is not valid
          pristine: '--pristine', // control has not been interacted with
          dirty: '--dirty' // control has been interacted with
        },
        dictionary: {
          fr: {
            attributes: {
              name: 'nom',
              description: 'description',
              username: "nom d'utilisateur",
              password: 'mot de passe',
              passwordConfirmation: 'confirmation du mot de passe'
            },
            custom: {
              username: {
                required:
                  "Un nom d'utilisateur est nécessaire pour te connecter"
              },
              password: {
                required: "Tu as besoin d'un mot de passe pour te connecter"
              },
              passwordConfirmation: {
                required: 'Pour être sûr, rentre à nouveau ton mot de passe',
                is: 'Les mots de passe semblent ne pas correspondre :('
              }
            }
          }
        }
      }
    ]
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    WS_URL: process.env.WS_URL || 'http://localhost:8000'
  },
  toast: {
    // theme: 'outline',
    position: 'bottom-left',
    duration: 3000,
    iconPack: 'fontawesome'
    // action: {
    //   text: 'OK',
    //   onClick: (e, toastObject) => {
    //     toastObject.goAway(0)
    //   }
    // }
  },
  router: {
    middleware: ['auth']
  },
  axios: {
    baseURL: 'http://localhost:3000/api',
    proxyHeaders: false,
    credentials: false
  },
  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/',
      home: '/groups/list'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/users/login',
            method: 'post',
            propertyName: 'user.token'
          },
          logout: false,
          user: {
            url: '/users/current',
            method: 'get',
            propertyName: 'user'
          }
        },
        tokenRequired: true
      }
    }
  }
}
