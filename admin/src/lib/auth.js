import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://api.cups.gg/api";

const adminURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/external/v1"
    : "https://api.cups.gg/api/external/v1";

export default {
  state: {
    authenticated: false,
    user: null,
  },

  get() {
    return this.state;
  },

  checkAuth(token) {
    return new Promise((resolve, reject) => {
      axios
        .get(baseURL + "/user", {
          headers: {
            "x-auth-token": token ? token : "",
          },
        })
        .then(resp => {
          this.state.authenticated = !!resp.data;
          this.state.user = resp.data.user;

          return resolve(this.state);
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.state.authenticated = false;
            return resolve(this.state);
          }
          reject(new Error(err));
        });
    });
  },

  checkAccess(token) {
    return new Promise((resolve, reject) => {
      axios
        .get(adminURL + "/testAuthentication", {
          headers: {
            "x-auth-token": token ? token : "",
          },
        })
        .then(resp => {
          return resolve(resp.data.success);
        })
        .catch(err => {
          console.log(err);
          if (err.response.status === 401) {
            return resolve(false);
          }
          reject(new Error(err));
        });
    });
  },

  init(token) {
    return this.checkAuth(token);
  },
};
