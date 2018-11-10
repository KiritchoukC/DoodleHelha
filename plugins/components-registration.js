import Vue from 'vue'
import GroupForm from '../components/group-form'
import PollForm from '../components/poll-form'
import ListItem from '../components/list-item'
import Loading from '../components/loading'
import Calendar from '../components/calendar'
import Multiselect from 'vue-multiselect'

Vue.component('group-form', GroupForm)
Vue.component('poll-form', PollForm)
Vue.component('list-item', ListItem)
Vue.component('loading', Loading)
Vue.component('calendar', Calendar)
Vue.component('multiselect', Multiselect)
