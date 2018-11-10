// import Vue from 'vue'
// // the component
// import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
// // the library
// import fontawesome from '@fortawesome/fontawesome'
// // add more icon categories as you want them, even works with pro packs
// import brands from '@fortawesome/fontawesome-free-brands'

// // asociate it to the library, if you need to add more you can separate them by a comma
// fontawesome.library.add(brands)
// Vue.component('font-awesome-icon', FontAwesomeIcon)

import Vue from 'vue'
import '@fortawesome/fontawesome/styles.css'
// import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

fontawesome.config = {
  autoAddCss: false
}

fontawesome.library.add(faCoffee)
fontawesome.library.add(faEdit)

Vue.component('font-awesome-icon', FontAwesomeIcon)
