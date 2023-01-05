export default {
  name: 'Sidebar',
  data() {
    return {
      links: [
        {
          name: 'Dashboard',
          icon: 'mdi-speedometer',
        },
        {
          name: 'Users',
          icon: 'mdi-account-multiple',
        },
        {
          name: 'Transactions',
          icon: 'mdi-history',
        },
        {
          name: 'ManualWithdrawals',
          icon: 'mdi-lock-open-check',
        },
        {
          name: 'Vips',
          icon: 'mdi-star',
        },
        {
          name: 'Race',
          icon: 'mdi-timer',
        },
        {
          name: 'Trivia',
          icon: 'mdi-head-question',
        },
        {
          name: 'Coupons',
          icon: 'mdi-gift',
        },
      ],
    }
  },
  methods: {
    navigate(name) {
      if (this.$route.name === name) return
      this.$router.push({ name })
    },
  },
  computed: {
    active() {
      return this.$route.name
    },
  },
}
