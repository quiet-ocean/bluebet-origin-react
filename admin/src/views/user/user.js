import WalletTransactions from '@/components/user/walletTransactions'

export default {
  name: 'User',
  store: ['actions'],
  components: {
    WalletTransactions,
  },
  data() {
    return {
      loading: true,
      userData: {
        username: '',
        rank: null,
        avatar: '',
        wallet: 0,
        banExpires: 0,
        mutExpires: 0,
        stats: {
          deposited: {
            name: 'Deposited',
            value: 0,
            currency: true,
          },
          withdrawn: {
            name: 'Withdrawn',
            value: 0,
            currency: true,
          },
          wagered: {
            name: 'Wagered',
            value: 0,
            currency: true,
          },
          couponsClaimed: {
            name: 'Coupons Claimed',
            value: 0,
            currency: true,
          },
        },
        vip: {
          enabled: false,
          name: 'VIP Bronze',
          color: '#c06300',
        },
      },
      banned: null,
      muted: null,
      transactionsLocked: null,
      betsLocked: null,
      verified: null,
      selectedRank: null,
      updateWallet: null,
      updateCustomWagerLimit: null,
      ranks: [
        { name: 'User', id: 1 },
        { name: 'Sponsor', id: 2 },
        { name: 'Developer', id: 3 },
        { name: 'Moderator', id: 4 },
        { name: 'Administrator', id: 5 },
      ],
      transactions: [],
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve) => {
        Promise.all([
          this.actions.user.lookup(this.userId),
          this.actions.user.walletTransactions(this.userId),
        ])
          .then((resp) => {
            resolve({ user: resp[0].data, transactions: resp[1].data })
          })
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
        this.parseUserData(data.user)
        this.transactions = data.transactions
      })
    },
    parseUserData(data) {
      this.banned = new Date(parseInt(data.banExpires))
      this.muted = new Date(parseInt(data.muteExpires))
      this.betsLocked = data.betsLocked
      this.transactionsLocked = data.transactionsLocked
      this.verified = data.hasVerifiedAccount
      this.selectedRank = data.rank
      this.updateWallet = parseFloat(data.wallet.toFixed(2))
      this.updateCustomWagerLimit = parseFloat(data.customWagerLimit.toFixed(2))
      this.userData = Object.assign(this.userData, data)
      this.userData.stats.deposited.value = data.totalDeposited
      this.userData.stats.withdrawn.value = data.totalWithdrawn
      this.userData.stats.wagered.value = data.wager
      this.userData.stats.couponsClaimed.value = data.extraStatistics.couponsClaimed
    },
    updateUser(value) {
      this.loading = true
      this.actions.user
        .update({
          userId: this.userId,
          banExpires:
            value === 'banExpires'
              ? new Date(this.banned).getTime()
              : parseInt(this.userData.banExpires),
          muteExpires:
            value === 'muteExpires'
              ? new Date(this.muted).getTime()
              : parseInt(this.userData.muteExpires),
          transactionsLocked:
            value === 'transactionsLocked'
              ? this.transactionsLocked
              : this.userData.transactionsLocked,
          betsLocked: value === 'betsLocked' ? this.betsLocked : this.userData.betsLocked,
          verified: value === 'verified' ? this.verified : this.userData.hasVerifiedAccount,
          rank:
            value === 'rank' && this.selectedRank.id ? this.selectedRank.id : this.userData.rank,
          wallet: value === 'wallet' ? this.updateWallet : this.userData.wallet,
          customWagerLimit:
            value === 'customWagerLimit'
              ? this.updateCustomWagerLimit
              : this.userData.customWagerLimit,
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully updated')
            this.getDataFromApi().then((data) => {
              this.parseUserData(data.user)
              this.transactions = data.transactions
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
      this.parseUserData(data.user)
      this.transactions = data.transactions
    })
  },
  computed: {
    userId() {
      return this.$route.params.userId
    },
  },
}
