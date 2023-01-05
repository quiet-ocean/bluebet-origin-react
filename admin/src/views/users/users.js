export default {
  name: 'Users',
  store: ['actions'],
  data() {
    return {
      loading: true,
      search: null,
      page: 1,
      pageCount: 2,
      itemsPerPage: 6,
      headers: [
        {
          text: 'Avatar',
          value: 'avatar',
          align: 'center',
          sortable: false,
        },
        { text: 'UID', value: '_id' },
        { text: 'Name', value: 'username' },
        { text: 'Balance', value: 'wallet' },
        { text: 'Rank', value: 'rank' },
        { text: 'Bets', value: 'betsLocked' },
        { text: 'Transactions', value: 'transactionsLocked' },
        { text: 'Profile', value: 'profile', sortable: false },
      ],
      users: [],
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve) => {
        this.actions.users
          .list()
          .then((resp) => resolve(resp.data))
          .catch((err) => {
            this.$noty.error(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    refresh() {
      if (this.loading) return
      this.getDataFromApi().then((data) => {
        this.users = data
      })
    },
  },
  beforeMount() {
    this.getDataFromApi().then((data) => {
      this.users = data
    })
  },
  computed: {
    filteredUsers() {
      if (!this.search) return this.users
      return this.users.filter(
        (x) =>
          x._id.toLowerCase() == this.search.toLowerCase() ||
          (x.providerId && x.providerId == this.search) ||
          x.username.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
}
