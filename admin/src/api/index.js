import axios from "axios";
import * as endpoints from "./endpoints";

// const instance = axios.create({
//   baseURL: 'https://api-dev.cups.gg/api/external/v1',
//   headers: {
//     'x-auth-token': '',
//   },
//   responseType: 'json',
// })

let instance;

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/external/v1"
    : "https://api.cups.gg/api/external/v1";

export default {
  init(token) {
    instance = axios.create({
      baseURL: baseURL,
      headers: {
        "x-auth-token": token,
      },
      responseType: "json",
    });
  },
  actions: {
    controls: {
      get() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.CONTROLS_GET)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      toggle(name) {
        return new Promise((resolve, reject) => {
          instance
            .post(endpoints.CONTROLS_TOGGLE, { name })
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    statistics: {
      dashboard() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.STATISTICS_DASHBOARD)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    users: {
      list() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.USERS_LIST)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    user: {
      lookup(userId) {
        return new Promise((resolve, reject) => {
          instance
            .get(`${endpoints.USER_LOOKUP}/${userId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      update({
        userId,
        banExpires,
        muteExpires,
        transactionsLocked,
        betsLocked,
        rank,
        verified,
        wallet,
        customWagerLimit,
      }) {
        return new Promise((resolve, reject) => {
          instance
            .post(`${endpoints.USER_UPDATE}`, {
              _id: userId,
              banExpires,
              muteExpires,
              transactionsLocked,
              betsLocked,
              rank,
              verified,
              wallet,
              customWagerLimit,
            })
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      walletTransactions(userId) {
        return new Promise((resolve, reject) => {
          instance
            .get(`${endpoints.USER_WALLET_TRANSACTIONS}/${userId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    transactions: {
      list() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.TRANSACTIONS_LIST)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    transaction: {
      lookup(transactionId) {
        return new Promise((resolve, reject) => {
          instance
            .get(`${endpoints.TRANSACTION_LOOKUP}/${transactionId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      confirm(transactionId) {
        return new Promise((resolve, reject) => {
          instance
            .post(`${endpoints.TRANSACTION_CONFIRM}/${transactionId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      cancel(transactionId) {
        return new Promise((resolve, reject) => {
          instance
            .post(`${endpoints.TRANSACTION_CANCEL}/${transactionId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    coupons: {
      list() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.COUPONS_LIST)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    coupon: {
      lookup(couponId) {
        return new Promise((resolve, reject) => {
          instance
            .get(`${endpoints.COUPON_LOOKUP}/${couponId}`)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      add({ code, uses, message, payout }) {
        return new Promise((resolve, reject) => {
          instance
            .put(endpoints.COUPON_ADD, { code, uses, message, payout })
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    race: {
      get() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.RACE_GET)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      create({ prize, endingDate }) {
        return new Promise((resolve, reject) => {
          instance
            .put(endpoints.RACE_CREATE, { prize, endingDate })
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      end() {
        return new Promise((resolve, reject) => {
          instance
            .post(endpoints.RACE_END)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
    trivia: {
      get() {
        return new Promise((resolve, reject) => {
          instance
            .get(endpoints.TRIVIA_GET)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      create({ question, answer, prize, winnerAmount }) {
        return new Promise((resolve, reject) => {
          instance
            .put(endpoints.TRIVIA_CREATE, {
              question,
              answer,
              prize,
              winnerAmount,
            })
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
      end() {
        return new Promise((resolve, reject) => {
          instance
            .post(endpoints.TRIVIA_END)
            .then(resp => {
              resolve(resp);
            })
            .catch(err => {
              reject(err.response.data.error);
            });
        });
      },
    },
  },
};
