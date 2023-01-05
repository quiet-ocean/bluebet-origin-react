export default {
  name: "Top",
  data() {
    return {
      page: 1,
      pageCount: 2,
      itemsPerPage: 10,
      headers: [
        {
          text: "Avatar",
          value: "avatar",
          align: "center",
          sortable: false,
        },
        { text: "UID", value: "uid" },
        { text: "Name", value: "username" },
        { text: "Balance", value: "balance" },
        { text: "Wagered", value: "wagered" },
        { text: "Profit", value: "profit" },
        { text: "Prize", value: "prize" },
        { text: "Rank", value: "rank" },
        { text: "Profile", value: "profile", sortable: false },
      ],
      top: [],
    };
  },
};
