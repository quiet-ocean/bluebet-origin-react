import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://api.cups.gg/api";

export default {
  name: "Login",
  store: ["auth"],
  data() {
    return {
      providers: [],
    };
  },
  methods: {
    authUrl(provider) {
      return window.location.hostname === "localhost"
        ? baseURL + `/auth/${provider}?redirect=adminpanel-dev`
        : baseURL + `/auth/${provider}?redirect=adminpanel`;
    },
    color(provider) {
      switch (provider) {
        case "google":
          return "#DB4437";
        case "steam":
          return "#171a21";
        default:
          "white";
      }
    },
  },
  beforeMount() {
    if (this.$ls.get("token")) this.$router.push("/dashboard");
    if (!this.$route.query.token) {
      axios
        .get(baseURL + "/auth")
        .then(resp => {
          resp.data.providers.forEach(x => (x.name = x.name.toLowerCase()));
          this.providers = resp.data.providers;
        })
        .catch(err => console.log(new Error(err)));
    } else {
      axios
        .post(baseURL + "/auth/exchange-token", {
          token: this.$route.query.token,
        })
        .then(resp => {
          this.$ls.set("token", resp.data.token, 100 * 60 * 60 * 1000);
          this.$router.push({ path: "/dashboard" });
        })
        .catch(err => console.log(new Error(err)));
    }
  },
  computed: {
    user() {
      if (this.auth.authenticated) return this.auth.user;
      else return null;
    },
  },
};
