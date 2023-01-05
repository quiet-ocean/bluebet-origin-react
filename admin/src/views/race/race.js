import Stat from '@/components/stat'
import Top from '@/components/race/top'

export default {
  name: 'Race',
  store: ['actions'],
  components: {
    Stat,
    Top,
  },
  data() {
    return {
      loading: true,
      setStartingAt: null,
      setEndingAt: null,
      setPrizePool: null,
      currentStartedAt: '',
      currentEndingAt: '',
      currentPrizePool: 0,
      stats: [
        // {
        //   title: 'Total Profit',
        //   current: '$1.234',
        //   type: 'normal',
        //   raise: true,
        // },
        // {
        //   title: 'Total Bets',
        //   current: '1.234',
        //   type: 'green',
        //   raise: true,
        // },
      ],
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve) => {
        this.actions.race
          .get()
          .then((resp) => resolve(resp.data))
          .catch((err) => {
            this.$noty.error(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    parseData(data) {
      if (data) {
        this.currentPrizePool = data.prize
        this.currentStartedAt = data.created
        this.currentEndingAt = data.endingDate
      } else {
        this.currentStartedAt = 'Not started yet'
        this.currentEndingAt = 'Not started yet'
      }
    },
    end() {
      this.loading = true
      this.actions.race
        .end()
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully ended the current race')
            this.getDataFromApi().then((data) => {
              this.parseData(data)
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
    create() {
      this.loading = true
      this.actions.race
        .create({ prize: this.setPrizePool, endingDate: new Date(this.setEndingAt).getTime() })
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully started a new race')
            this.getDataFromApi().then((data) => {
              this.parseData(data)
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
      this.parseData(data)
    })
  },
}
