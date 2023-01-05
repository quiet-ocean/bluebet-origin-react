<template>
  <v-card class="mt-3" color="card" elevation="1">
    <v-container>
      <v-row class="px-2" align="center">
        <v-text-field
          class="pt-0"
          v-model="search"
          placeholder="Search for transaction"
        ></v-text-field>
        <v-spacer />
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="filteredTransactions"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :loading="loading"
      hide-default-footer
      class="transactions-table elevation-0 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.extraData="{ item }">
        <span v-for="(value, key) in item.extraData" :key="key">{{ key }}: {{ value }}</span>
      </template>
      <template v-slot:item.amount="{ item }">
        <span :class="{ 'success--text': item.amount > 0, 'error--text': item.amount < 0 }">{{
          item.amount.toFixed(2)
        }}</span>
      </template>
      <template v-slot:item.created="{ item }">{{
        new Date(item.created) | dateFormat('DD.MM.YYYY HH:mm:ss')
      }}</template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </v-card>
</template>

<script src="./walletTransactions.js"></script>
