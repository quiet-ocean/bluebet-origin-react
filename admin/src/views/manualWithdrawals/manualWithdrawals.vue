<template>
  <div class="transactions">
    <v-container fluid>
      <v-row align="center">
        <v-text-field
          class="pt-0"
          v-model="search"
          placeholder="Search for withdrawal"
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
      <template v-slot:item.siteValue="{ item }">${{ item.siteValue.toFixed(2) }}</template>
      <template v-slot:item.created="{ item }">{{
        new Date(item.created) | dateFormat('DD.MM.YYYY HH:mm:ss')
      }}</template>
      <template v-slot:item.actions="{ item }">
        <v-menu offset-y top nudge-left="55" nudge-top="10">
          <template v-slot:activator="{ on }">
            <v-btn color="success" outlined small v-on="on">Confirm</v-btn>
          </template>
          <v-card color="card">
            <v-card-text class="py-2 text-center">Please confirm this action</v-card-text>
            <v-card-actions class="pt-1 pb-2">
              <v-btn class="mx-auto" color="success" small text @click="confirm(item._id)"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu offset-y top nudge-left="55" nudge-top="10">
          <template v-slot:activator="{ on }">
            <v-btn class="ml-3" color="error" outlined small v-on="on">Cancel</v-btn>
          </template>
          <v-card color="card">
            <v-card-text class="py-2 text-center">Please confirm this action</v-card-text>
            <v-card-actions class="pt-1 pb-2">
              <v-btn class="mx-auto" color="error" small text @click="cancel(item._id)"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>
    <v-pagination class="mt-3" color="#272B2F" v-model="page" :length="pageCount"></v-pagination>
  </div>
</template>

<script src="./manualWithdrawals.js"></script>
