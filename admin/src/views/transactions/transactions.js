export default {
  name: 'Transactions',
  store: ['actions'],
  data() {
    return {
      loading: true,
      search: null,
      page: 1,
      pageCount: 2,
      itemsPerPage: 10,
      headers: [
        {
          text: 'ID',
          value: '_id',
        },
        {
          text: 'UID',
          value: '_user._id',
        },
        {
          text: 'Name',
          value: '_user.username',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'State',
          value: 'state',
        },
        {
          text: 'Amount',
          value: 'siteValue',
        },
        {
          text: 'Crypto Amount',
          value: 'cryptoValue',
        },
        {
          text: 'Currency',
          value: 'currency',
        },
        {
          text: 'Time',
          value: 'created',
        },
        {
          text: 'TX ID',
          value: 'txid',
        },
      ],
      transactions: [],
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve) => {
        this.actions.transactions
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
        this.transactions = data
      })
    },
    getColor(state) {
      if (state === 3) return 'success'
      else if (state === 2) return 'error'
      else if (state === 1) return 'orange'
      else return 'primary'
    },
  },
  beforeMount() {
    this.getDataFromApi().then((data) => {
      this.transactions = data
    })
  },
  computed: {
    filteredTransactions() {
      if (!this.search) return this.transactions
      return this.transactions.filter(
        (x) =>
          x._id == this.search ||
          x.txid == this.search ||
          `0x${x.txid}` == this.search ||
          (x._user && x._user._id == this.search) ||
          (x._user && x._user.username.toLowerCase().includes(this.search.toLowerCase()))
      )
    },
  },
}
