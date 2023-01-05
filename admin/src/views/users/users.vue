<template>
  <div class="users">
    <v-container fluid>
      <v-row align="center">
        <v-text-field class="pt-0" v-model="search" placeholder="Search for user"></v-text-field>
        <v-spacer />
        <v-btn small outlined color="#788088" @click="refresh" :loading="loading">Refresh</v-btn>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :loading="loading"
      hide-default-footer
      class="users-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.avatar="{ item }">
        <img class="avatar my-3" :src="item.avatar" alt="USER AVATAR" />
      </template>
      <template v-slot:item.rank="{ item }">{{item.rank | convertRank}}</template>
      <template v-slot:item.wallet="{ item }">${{ item.wallet.toFixed(2) }}</template>
      <template v-slot:item.betsLocked="{ item }">{{ item.betsLocked ? 'Locked' : 'Unlocked' }}</template>
      <template
        v-slot:item.transactionsLocked="{ item }"
      >{{ item.transactionsLocked ? 'Locked' : 'Unlocked' }}</template>
      <template v-slot:item.profile="{ item }">
        <v-btn
          class="px-5"
          color="#788088"
          small
          outlined
          rounded
          link
          :to="`/dashboard/user/${item._id}`"
        >User</v-btn>
      </template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </div>
</template>

<script src="./users.js"></script>

<style lang="scss" scoped>
.users-table {
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}
</style>
