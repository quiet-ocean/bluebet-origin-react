<template>
  <div class="d-flex justify-space-between align-center">
    <div>
      <div class="head">{{ $t(`navbar.titles.${active}`) }}</div>
      <div class="path">
        Panel >
        <span :class="{active: !userId}">{{ $t(`navbar.titles.${active}`) }}</span>
        {{userId ? '>' : ''}}
        <span v-if="userId" class="active">{{ userId }}</span>
      </div>
    </div>
    <div class="d-flex align-center">
      <img v-if="user" class="avatar" :src="user.avatar" alt="USER AVATAR" draggable="false" />
      <v-btn color="#484F56" class="ml-4" icon to="/logout">
        <v-icon small>mdi-logout</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script src="./navbar.js"></script>

<style lang="scss" scoped>
.head {
  font-size: 28px;
  font-weight: 500;
}

.path {
  font-size: 14px;
  color: #4a525a;

  .active {
    color: #798693;
  }
}

.avatar {
  border-radius: 50%;
  width: 45px;
  height: 45px;
}
</style>
