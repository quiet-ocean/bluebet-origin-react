export default {
  name: 'Logout',
  mounted() {
    this.$ls.remove('token')
    this.$router.push('/login')
  },
}
