import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#337ab7',
        background: '#212529',
        card: '#272b2f',
      },
    },
  },
})
