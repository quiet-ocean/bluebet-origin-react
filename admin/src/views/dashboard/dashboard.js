import Stat from '@/components/stat'

export default {
  name: 'Dashboard',
  store: ['actions'],
  components: {
    Stat,
  },
  data() {
    return {
      loading: true,
      controls: {
        maintenanceEnabled: null,
        loginEnabled: null,
        depositsEnabled: null,
        withdrawsEnabled: null,
        gamesEnabled: {
          cupsEnabled: null,
          shuffleEnabled: null,
          kingEnabled: null,
          rouletteEnabled: null,
          crashEnabled: null,
        },
      },
      mainStats: {
        userStatistics: {
          totalValueToday: 0,
          isRising: false,
          isFloat: false,
          graphData: {
            labels: [],
            data: [],
          },
        },
        profitStatistics: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
        depositStatistics: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
        withdrawStatistics: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
      },
      gameStats: {
        crash: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
        cups: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
        shuffle: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
        roulette: {
          totalValueToday: 0,
          isRising: false,
          isFloat: true,
          graphData: {
            labels: [],
            data: [],
          },
        },
      },
    }
  },
  methods: {
    getDataFromApi(silent) {
      if (!silent) this.loading = true
      return new Promise((resolve) => {
        Promise.all([this.actions.statistics.dashboard(), this.actions.controls.get()])
          .then((resp) => {
            resolve({ stats: resp[0].data, controls: resp[1].data })
          })
          .catch((err) => {
            this.$noty.error(err)
          })
          .finally(() => {
            if (!silent) this.loading = false
          })
      })
    },
    refresh() {
      if (this.loading) return
      this.getDataFromApi().then((data) => {
        this.parseSiteData(data)
      })
    },
    toggle(name) {
      this.actions.controls
        .toggle(name)
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully updated')
            this.getDataFromApi(true).then((data) => {
              this.parseSiteData(data)
            })
          }
        })
        .catch((err) => {
          this.$noty.error(err)
        })
    },
    parseSiteData(data) {
      this.controls = Object.assign(this.controls, data.controls)
      for (const [key, stat] of Object.entries(data.stats.gamesStatistics)) {
        console.log(key, stat)
        this.gameStats[key] = Object.assign(this.gameStats[key], stat)
      }
      delete data.stats.gamesStatistics
      for (const [key, stat] of Object.entries(data.stats)) {
        this.mainStats[key] = Object.assign(this.mainStats[key], stat)
      }
    },
  },
  beforeMount() {
    this.getDataFromApi().then((data) => {
      this.parseSiteData(data)
    })
  },
}
