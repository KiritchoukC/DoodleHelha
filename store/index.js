import Vue from 'vue'
import Vuex from 'vuex'
var cookieparser = require('cookieparser')

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    state: {
      auth: null,
      accessToken: null
    },

    mutations: {
      update: function(state, data) {
        state.auth = data
      },
      setAccessToken: function(state, data) {
        state.accessToken = data
      }
    },

    actions: {
      nuxtServerInit({ commit }, { req }) {
        let accessToken = null
        if (req.headers.cookie) {
          var parsed = cookieparser.parse(req.headers.cookie)
          if (parsed.auth) {
            accessToken = parsed.auth
          }
        }
        commit('setAccessToken', accessToken)
      }
    }
  })
}

export default store
