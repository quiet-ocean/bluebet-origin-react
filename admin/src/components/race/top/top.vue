<template>
  <div class="top">
    <div class="title my-5">Top 30</div>
    <v-data-table
      :headers="headers"
      :items="top"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="top-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.avatar="{ item }">
        <img class="avatar my-3" :src="item.avatar" alt="USER AVATAR" />
      </template>
      <template v-slot:item.balance="{ item }">${{item.balance.toFixed(2)}}</template>
      <template v-slot:item.wagered="{ item }">${{item.wagered.toFixed(2)}}</template>
      <template v-slot:item.profit="{ item }">
        <span :class="item.profit >= 0 ? 'success--text' : 'error--text'">
          {{item.profit >= 0 ? '+' : '-'}}
          ${{item.profit.toFixed(2).replace(/[\+-]/, '')}}
        </span>
      </template>
      <template v-slot:item.prize="{ item }">${{item.prize.toFixed(2)}}</template>
      <template v-slot:item.rank="{ item }">#{{item.rank}}</template>
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

<script src="./top.js"></script>

<style lang="scss" scoped>
.top-table {
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}
</style>
