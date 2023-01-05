<template>
  <div class="vips">
    <v-data-table
      :headers="headers"
      :items="users"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="users-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.avatar="{ item }">
        <img class="avatar my-3" :src="item.avatar" alt="USER AVATAR" />
      </template>
      <template v-slot:item.vip.rank="{ item }">
        <span :style="{color: item.vip.color}">{{item.vip.rank}}</span>
      </template>
      <template v-slot:item.xp.current="{ item }">{{`${item.xp.current} / ${item.xp.target}`}}</template>
      <template v-slot:item.profile="{ item }">
        <v-btn
          class="px-5"
          color="#788088"
          small
          outlined
          rounded
          link
          :to="`/user/${item.uid}/${item.username}`"
        >User</v-btn>
      </template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </div>
</template>

<script src="./vips.js"></script>

<style lang="scss" scoped>
.users-table {
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}
</style>
