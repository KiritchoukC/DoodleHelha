import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, process.env.WS_URL)
