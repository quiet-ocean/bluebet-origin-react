<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {}
};
</script>

<style lang="scss">
.noty_theme__mint {
  font-family: "Rubik", sans-serif;
}

.main-container {
  padding: 4.2vh 4vw !important;
}

.v-data-table th {
  font-weight: 400;
}
</style>
