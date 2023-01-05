<template>
  <v-navigation-drawer class="sidebar" color="#272B2F" width="105px" permanent app>
    <v-list class="links">
      <v-list-item
        v-for="(item, i) in links"
        :key="i"
        class="link d-flex justify-center"
        :class="{'selected': item.name === active}"
        link
        @click="navigate(item.name)"
      >
        <v-list-item-icon class="mx-0">
          <v-icon :color="item.name === active ? '#5367ff' : '#4d545d'">{{item.icon}}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script src="./sidebar.js"></script>

<style lang="scss" scoped>
.links {
  margin-top: 115px;

  .link {
    border-right: 3px solid transparent;
    transition: all 0.5s ease;

    &.selected {
      border-color: #5367ff;
      background-image: -webkit-linear-gradient(
        180deg,
        rgba(83, 103, 255, 0.175) 0%,
        rgba(39, 43, 47, 0.175) 85%
      );
    }
  }
}
</style>