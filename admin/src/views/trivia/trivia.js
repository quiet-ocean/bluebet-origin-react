export default {
  name: 'Trivia',
  store: ['actions'],
  data() {
    return {
      loading: true,
      create: {
        question: '',
        answer: '',
        prize: null,
        quantity: null,
      },
      current: {
        question: '',
        answer: '',
        prize: 0,
        quantity: 0,
      },
      page: 1,
      pageCount: 2,
      itemsPerPage: 10,
      headers: [
        {
          text: 'Avatar',
          value: 'avatar',
          align: 'center',
          sortable: false,
        },
        { text: 'UID', value: 'uid' },
        { text: 'Name', value: 'username' },
        { text: 'Balance', value: 'balance' },
        { text: 'Question', value: 'question' },
        { text: 'Answer', value: 'answer' },
        { text: 'Prize', value: 'prize' },
        { text: 'Profile', value: 'profile', sortable: false },
      ],
      winners: [],
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve) => {
        this.actions.trivia
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
        this.current.question = data.question
        this.current.answer = data.answer
        this.current.prize = data.prize
        this.current.quantity = data.winnerAmount
      } else {
        this.current.question = 'Not started yet'
        this.current.answer = 'Not started yet'
        this.current.prize = 0
        this.current.quantity = 0
      }
    },
    end() {
      this.loading = true
      this.actions.trivia
        .end()
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully ended the current trivia')
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
    start() {
      this.loading = true
      this.actions.trivia
        .create({
          question: this.create.question,
          answer: this.create.answer,
          prize: this.create.prize,
          winnerAmount: this.create.quantity,
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.$noty.success('Successfully started a new trivia')
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
  watch: {
    'create.prize'() {
      if (this.create.prize.length === 0) return
      this.create.prize = parseFloat(this.create.prize)
    },
    'create.quantity'() {
      if (this.create.quantity.length === 0) return
      this.create.quantity = parseInt(this.create.quantity)
    },
  },
  computed: {
    prize() {
      return this.create.prize > 0 ? parseFloat(this.create.prize) : 0
    },
    quantity() {
      return this.create.quantity > 0 ? parseFloat(this.create.quantity) : 0
    },
    invalid() {
      return (
        this.create.question.length === 0 ||
        this.create.answer.length === 0 ||
        this.prize <= 0 ||
        this.quantity <= 0
      )
    },
  },
  beforeMount() {
    this.getDataFromApi().then((data) => {
      this.parseData(data)
    })
  },
}
