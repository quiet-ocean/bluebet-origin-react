<template>
  <div class="transactions">
    <v-container fluid>
      <v-row align="center">
        <v-text-field
          class="pt-0"
          v-model="search"
          placeholder="Search for transaction"
        ></v-text-field>
        <v-spacer />
        <v-btn small outlined color="#788088" @click="refresh" :loading="loading">Refresh</v-btn>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="filteredTransactions"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :loading="loading"
      hide-default-footer
      class="transactions-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item._user.username="{ item }">
        <v-btn
          v-if="item._user"
          link
          :to="`/dashboard/user/${item._user._id}`"
          color="#5367FF"
          small
          text
          >{{ item._user.username }}</v-btn
        >
      </template>
      <template v-slot:item.type="{ item }">{{ item.type | capitalize }}</template>
      <template v-slot:item.state="{ item }">
        <v-chip :color="getColor(item.state)" label dark>{{
          item.state | convertTransactionState
        }}</v-chip>
      </template>
      <template v-slot:item.siteValue="{ item }">${{ item.siteValue.toFixed(2) }}</template>
      <template v-slot:item.created="{ item }">{{
        new Date(item.created) | dateFormat('DD.MM.YYYY HH:mm:ss')
      }}</template>
      <template v-slot:item.txid="{ item }">
        <v-tooltip bottom color="#272b2f" v-if="item.currency == 'BTC'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="warning"
              small
              text
              link
              :href="`https://www.blockchain.com/btc/tx/${item.txid}`"
              target="_blank"
              v-bind="attrs"
              v-on="on"
              >Explorer</v-btn
            >
          </template>
          <span>{{ item.txid }}</span>
        </v-tooltip>
        <v-tooltip bottom color="#272b2f" v-if="item.currency == 'ETH'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="warning"
              small
              text
              link
              :href="`https://etherscan.io/tx/0x${item.txid}`"
              target="_blank"
              v-bind="attrs"
              v-on="on"
              >Explorer</v-btn
            >
          </template>
          <span>0x{{ item.txid }}</span>
        </v-tooltip>
        <v-tooltip bottom color="#272b2f" v-if="item.currency == 'LTC'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="warning"
              small
              text
              link
              :href="`https://live.blockcypher.com/ltc/tx/${item.txid}`"
              target="_blank"
              v-bind="attrs"
              v-on="on"
              >Explorer</v-btn
            >
          </template>
          <span>{{ item.txid }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </div>
</template>

<script src="./transactions.js"></script>
