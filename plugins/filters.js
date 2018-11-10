import Vue from 'vue'
import moment from 'moment'

// Return the time of a datetime
Vue.filter('getTime', function(value) {
  if (!value) return ''
  return moment(value).format('HH:mm')
})

// Return the date of a datetime
Vue.filter('getDate', function(value) {
  if (!value) return ''
  return moment(value).format('DD-MM-YYYY')
})
