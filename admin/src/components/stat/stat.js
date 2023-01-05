export default {
  name: 'Stat',
  props: {
    title: String,
    totalValueToday: Number,
    graphData: Object,
    isRising: Boolean,
    isFloat: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      value: [],
    }
  },
  computed: {
    gradient() {
      if (this.title == 'depositStatistics') return ['green', 'rgba(39,43,47,0.6)']
      if (this.title == 'withdrawStatistics') return ['red', 'rgba(39,43,47,0.6)']
      else return ['rgb(83, 103, 255)', 'rgba(39,43,47,0.6)']
    },
  },
}
