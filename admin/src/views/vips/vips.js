export default {
  name: "Vips",
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
        { text: "VIP Rank", value: "vip.rank" },
        { text: "Experience", value: "xp.current" },
        { text: "Date", value: "date" },
        { text: "Profile", value: "profile", sortable: false },
      ],
      users: [],
    };
  },
};
