<template>
  <div class="coupons">
    <v-card class="pa-5" color="card" elevation="1">
      <div class="head">{{ $t('coupons.actions') }}</div>
      <v-container class="px-0 pb-0" fluid>
        <v-row justify="center">
          <v-col md="6" cols="12">
            <v-text-field
              v-model="create.name"
              type="text"
              label="Name"
              prepend-icon="mdi-gift"
              hide-details
              dense
              outlined
              rounded
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              v-model="create.message"
              type="text"
              label="Message"
              prepend-icon="mdi-comment"
              hide-details
              dense
              outlined
              rounded
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              v-model.number="create.reward"
              type="number"
              min="0"
              label="Reward"
              prepend-icon="mdi-currency-usd"
              hide-details
              dense
              outlined
              rounded
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              v-model.number="create.uses"
              type="number"
              min="0"
              label="Max Uses"
              prepend-icon="mdi-account-group"
              hide-details
              dense
              outlined
              rounded
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-btn color="#5367FF" block rounded :disabled="loading || invalid" @click="addCoupon"
              >Create Coupon</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <div class="title my-5">Last Coupons</div>
    <v-container fluid>
      <v-row align="center">
        <v-text-field class="pt-0" v-model="search" placeholder="Search for coupon"></v-text-field>
        <v-spacer />
        <v-btn small outlined color="#788088" @click="refresh" :loading="loading">Refresh</v-btn>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="filteredCoupons"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :loading="loading"
      hide-default-footer
      class="coupons-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.reward="{ item }">${{ item.reward.toFixed(2) }}</template>
      <template v-slot:item.active="{ item }">{{ item.active ? 'Yes' : 'No' }}</template>
      <template v-slot:item.claimedUsers="{ item }">{{
        item.uses - item.claimedUsers.length
      }}</template>
      <template v-slot:item.created="{ item }">{{
        new Date(item.created) | dateFormat('DD.MM.YYYY HH:mm:ss')
      }}</template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </div>
</template>

<script src="./coupons.js"></script>

<style lang="scss" scoped>
.head {
  font-size: 14px;
  color: #474e55;
  line-height: 1.2;
}
</style>
