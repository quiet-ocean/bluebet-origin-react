export default {
  name: 'WalletTransactions',
  store: ['actions'],
  props: {
    transactions: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
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
          text: 'Amount',
          value: 'amount',
        },
        {
          text: 'Reason',
          value: 'reason',
        },
        {
          text: 'Extra',
          value: 'extraData',
        },
        {
          text: 'Time',
          value: 'created',
        },
      ],
    }
  },
  methods: {
    getColor(state) {
      if (state === 3) return 'success'
      else if (state === 2) return 'error'
      else if (state === 1) return 'orange'
      else return 'primary'
    },
  },
  computed: {
    filteredTransactions() {
      if (!this.search) return this.transactions
      return this.transactions.filter(
        (x) =>
          x._id == this.search ||
          x.amount == this.search ||
          x.reason.toLowerCase().includes(this.search.toLowerCase()) ||
          (x.extraData &&
            (x.extraData.cupsGameId == this.search ||
              x.extraData.kingGameId == this.search ||
              x.extraData.rouletteGameId == this.search ||
              x.extraData.transactionId == this.search ||
              x.extraData.couponId == this.search ||
              x.extraData.affiliatorId == this.search ||
              x.extraData.modifierId == this.search))
      )
    },
  },
}
