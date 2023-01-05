export default {
  name: 'Navbar',
  store: ['auth'],
  computed: {
    active() {
      return this.$route.meta.name
    },
    userId() {
      if (this.$route.name === 'User') return this.$route.params.userId
      else return null
    },
    user() {
      if (this.auth.authenticated) return this.auth.user
      else return null
    },
  },
}
