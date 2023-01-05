import Auth from '../../lib/auth'

import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'

export default {
  name: 'Layout',
  store: ['actionsInit'],
  components: {
    Sidebar,
    Navbar,
  },
  async beforeMount() {
    this.actionsInit(this.$ls.get('token'))
    let auth = await Auth.init(this.$ls.get('token'))

    if (!Object.keys(this.$store.auth).length) {
      this.$store.auth = auth
    }
  },
}
