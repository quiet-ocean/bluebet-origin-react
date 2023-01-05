<template>
  <div class="trivia">
    <v-container>
      <v-row>
        <v-col md="8" cols="12">
          <v-card class="pa-5" color="card" elevation="1">
            <div class="head">{{$t('trivia.actions')}}</div>
            <v-container class="px-0 pb-0" fluid>
              <v-row justify="center">
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="create.question"
                    type="text"
                    label="Question"
                    prepend-icon="mdi-help"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="create.answer"
                    type="text"
                    label="Answer"
                    prepend-icon="mdi-forum"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model.number="create.prize"
                    type="number"
                    min="0"
                    label="Prize"
                    prepend-icon="mdi-gift"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model.number="create.quantity"
                    type="number"
                    min="0"
                    label="Winners Quantity"
                    prepend-icon="mdi-account-group"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn
                    color="#5367FF"
                    block
                    rounded
                    :disabled="invalid"
                    @click="start"
                  >Start Trivia</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col md="4" cols="12">
          <v-card color="card">
            <v-list class="controls py-0" color="transparent">
              <v-subheader>{{ $t('trivia.actions') }}</v-subheader>
              <v-list-item>
                <v-list-item-content class="body-2">Force End Trivia</v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y top nudge-left="50" nudge-top="10">
                    <template v-slot:activator="{ on }">
                      <v-btn color="error" outlined small v-on="on">End Trivia</v-btn>
                    </template>
                    <v-card color="card">
                      <v-card-text class="py-2 text-center">Please confirm this action</v-card-text>
                      <v-card-actions class="pt-1 pb-2">
                        <v-btn class="mx-auto" color="primary" small text @click="end">Confirm</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <v-subheader>{{ $t('trivia.information') }}</v-subheader>
              <v-list-item>
                <v-list-item-content class="body-2">Current Question</v-list-item-content>
                <v-card-actions class="body-2 warning--text">{{ current.question }}</v-card-actions>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Current Answer</v-list-item-content>
                <v-card-actions class="body-2 success--text">{{ current.answer }}</v-card-actions>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Current Prize</v-list-item-content>
                <v-card-actions class="body-2">${{current.prize.toFixed(2)}}</v-card-actions>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Current Winner Amount</v-list-item-content>
                <v-card-actions class="body-2">{{current.quantity}}</v-card-actions>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="title my-5">Last Winners</div>
    <v-data-table
      :headers="headers"
      :items="winners"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="winners-table elevation-1 card"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.avatar="{ item }">
        <img class="avatar my-3" :src="item.avatar" alt="USER AVATAR" />
      </template>
      <template v-slot:item.balance="{ item }">${{item.balance.toFixed(2)}}</template>
      <template v-slot:item.prize="{ item }">${{item.prize.toFixed(2)}}</template>
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

<script src="./trivia.js"></script>

<style lang="scss" scoped>
.head {
  font-size: 14px;
  color: #474e55;
  line-height: 1.2;
}

.winners-table {
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}
</style>
