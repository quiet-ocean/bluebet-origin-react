<template>
  <div class="user">
    <v-container class="px-0" fluid>
      <v-row justify="center">
        <v-col lg="4" sm="11" cols="12">
          <v-card color="card" elevation="1">
            <div class="avatar-head">
              <div class="image" :style="{ 'background-image': `url(${userData.avatar})` }"></div>
            </div>
            <div class="user-info pb-5 text-center">
              <img class="avatar" :src="userData.avatar" alt="USER AVATAR" draggable="false" />
              <div class="username mt-3">{{ userData.username }}</div>
              <div class="rank mt-1">{{ userData.rank | convertRank }}</div>
              <div
                class="vip"
                v-if="userData.vip.enabled"
                :style="{ color: userData.vip.color }"
              >{{ userData.vip.name }}</div>
              <div class="refresh">
                <v-btn outlined small color="#5f656d" @click="refresh" :loading="loading">Refresh</v-btn>
              </div>
            </div>
            <div class="controls px-4">
              <v-list dense color="transparent">
                <v-list-item>
                  <v-list-item-content>Mute</v-list-item-content>
                  <v-list-item-action class="d-flex flex-row align-center">
                    <v-datetime-picker
                      color="card"
                      okText="Set"
                      :textFieldProps="{ hideDetails: true }"
                      v-model="muted"
                    >
                      <template v-slot:dateIcon>
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <template v-slot:timeIcon>
                        <v-icon>mdi-clock</v-icon>
                      </template>
                    </v-datetime-picker>
                    <v-btn
                      class="ml-4"
                      color="success"
                      small
                      outlined
                      @click="updateUser('muteExpires')"
                    >Update</v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content>Ban</v-list-item-content>
                  <v-list-item-action class="d-flex flex-row align-center">
                    <v-datetime-picker
                      color="card"
                      okText="Set"
                      :textFieldProps="{ hideDetails: true }"
                      v-model="banned"
                    >
                      <template v-slot:dateIcon>
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <template v-slot:timeIcon>
                        <v-icon>mdi-clock</v-icon>
                      </template>
                    </v-datetime-picker>
                    <v-btn
                      class="ml-4"
                      color="success"
                      small
                      outlined
                      @click="updateUser('banExpires')"
                    >Update</v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Lock Transactions</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      v-model="transactionsLocked"
                      @change="updateUser('transactionsLocked')"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Lock Bets</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      v-model="betsLocked"
                      @change="updateUser('betsLocked')"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Verified</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      v-model="verified"
                      @change="updateUser('verified')"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
            <v-container fluid>
              <v-row justify="space-between" align="center">
                <v-col md="8" sm="6" cols="12">
                  <v-select
                    v-model="selectedRank"
                    :items="ranks"
                    item-text="name"
                    item-value="id"
                    return-object
                    label="Rank"
                    prepend-icon="mdi-account-cog"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-select>
                </v-col>
                <v-col md="4" sm="6" cols="12">
                  <v-btn
                    color="#484b4e"
                    block
                    small
                    depressed
                    rounded
                    outlined
                    @click="updateUser('rank')"
                  >Update Rank</v-btn>
                </v-col>
                <v-col md="8" sm="6" cols="12">
                  <v-text-field
                    v-model.number="updateWallet"
                    type="number"
                    min="0"
                    label="Balance"
                    prepend-icon="mdi-currency-usd"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="4" sm="6" cols="12">
                  <v-btn
                    color="#32373D"
                    block
                    small
                    depressed
                    rounded
                    @click="updateUser('wallet')"
                  >Update Balance</v-btn>
                </v-col>
                <v-col md="8" sm="6" cols="12">
                  <v-text-field
                    v-model.number="updateCustomWagerLimit"
                    type="number"
                    min="0"
                    label="Custom Wager Limit"
                    prepend-icon="mdi-gamepad-square-outline"
                    hide-details
                    dense
                    outlined
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col md="4" sm="6" cols="12">
                  <v-btn
                    color="#32373D"
                    block
                    small
                    depressed
                    rounded
                    @click="updateUser('customWagerLimit')"
                  >Update Limit</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col lg="8" sm="11" cols="12">
          <v-card color="card" elevation="1">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(stat, i) in userData.stats"
                  :key="i"
                  lg="4"
                  cols="6"
                  class="text-center"
                >
                  <div class="stat-value">
                    <span v-if="stat.currency">$</span>
                    {{ stat.currency ? stat.value.toFixed(2) : stat.value }}
                  </div>
                  <div class="stat-name">{{ stat.name }}</div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <WalletTransactions :transactions="transactions" :loading="loading" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script src="./user.js"></script>

<style lang="scss" scoped>
.avatar-head {
  height: 120px;
  width: 100%;
  background-color: #303439;

  .image {
    width: 100%;
    height: 100%;
    opacity: 0.1;
    background-size: cover;
    background-position: center;
  }
}

.user-info {
  position: relative;
  border-bottom: 2px solid #484f56;

  .avatar {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    margin-top: -70px;
  }

  .username {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
  }

  .rank {
    font-size: 14px;
    color: #5367ff;
  }

  .vip {
    position: absolute;
    top: 15px;
    left: 3%;
    font-size: 14px;
    line-height: 1.2;
  }

  .refresh {
    position: absolute;
    top: 15px;
    right: 3%;
  }
}

.controls {
  border-bottom: 2px solid #484f56;

  .v-list-item__content {
    font-size: 14px;
    line-height: 1.2;
  }

  .v-list-item__action {
    margin: 0;
  }
}

.stat-value {
  font-size: 19px;
  font-weight: 500;
  line-height: 1.2;
}

.stat-name {
  font-size: 15px;
  line-height: 1.2;
  color: #484f56;
}
</style>
