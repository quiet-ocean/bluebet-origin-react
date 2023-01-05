export default {
  name: 'History',
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
          text: 'Amount',
          value: 'siteValue',
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
          text: 'Actions',
          value: 'actions',
          align: 'center',
          sortable: false,
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
    confirm(transactionId) {
      this.loading = true
      this.actions.transaction
        .confirm(transactionId)
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully confirmed the transaction')
            this.getDataFromApi().then((data) => {
              this.transactions = data
            })
          }
        })
        .catch((err) => {
          this.$noty.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    cancel(transactionId) {
      this.loading = true
      this.actions.transaction
        .cancel(transactionId)
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully canceled the transaction')
            this.getDataFromApi().then((data) => {
              this.transactions = data
            })
          }
        })
        .catch((err) => {
          this.$noty.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  beforeMount() {
    this.getDataFromApi().then((data) => {
      this.transactions = data
    })
  },
  computed: {
    filteredTransactions() {
      if (!this.search)
        return this.transactions.filter((x) => x.type === 'withdraw' && x.state === 4)
      return this.transactions.filter(
        (x) =>
          x.type === 'withdraw' &&
          x.state === 4 &&
          (x._id == this.search ||
            (x._user && x._user._id == this.search) ||
            (x._user && x._user.username.toLowerCase().includes(this.search.toLowerCase())))
      )
    },
  },
}
