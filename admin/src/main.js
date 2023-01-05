import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Vue Date Format
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
Vue.use(VueFilterDateFormat)

// vuetify-datetime-picker
import DatetimePicker from 'vuetify-datetime-picker'
Vue.use(DatetimePicker)

// Vue Noty
import VueNoty from 'vuejs-noty'
import 'vuejs-noty/dist/vuejs-noty.css'

Vue.use(VueNoty, {
  layout: 'bottomCenter',
  timeout: 3000,
})

// Vue Stash
import VueStash from 'vue-stash'
import store from './lib/store'
Vue.use(VueStash)

// Vue LS
import Storage from 'vue-ls'
Vue.use(Storage, {
  namespace: '', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
})

// Vue I18n
import VueI18n from 'vue-i18n'
import messages from './lang'
Vue.use(VueI18n)

let navigatorLang = window.navigator.language.split('-')[0]

const i18n = new VueI18n({
  locale: messages[navigatorLang] ? navigatorLang : 'en',
  fallbackLocale: 'en',
  messages,
})

Vue.filter('convertRank', function(rank) {
  switch (rank) {
    case 1:
      return 'User'
    case 2:
      return 'Sponsor'
    case 3:
      return 'Developer'
    case 4:
      return 'Moderator'
    case 5:
      return 'Admin'
    default:
      'Undefined'
  }
})

Vue.filter('convertTransactionState', function(rank) {
  switch (rank) {
    case 1:
      return 'Pending'
    case 2:
      return 'Declined'
    case 3:
      return 'Completed'
    case 4:
      return 'Manual'
    default:
      'Undefined'
  }
})

Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

import router from './router'
import Actions from './api'

new Vue({
  router,
  vuetify,
  i18n,
  data: {
    store,
  },
  beforeCreate() {
    store.actions = Actions.actions
    store.actionsInit = Actions.init

    if (this.$ls.get('lang') !== null) {
      this.$i18n.locale = this.$ls.get('lang')
    }
  },
  render: (h) => h(App),
}).$mount('#app')
