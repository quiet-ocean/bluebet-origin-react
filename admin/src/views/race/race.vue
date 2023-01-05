<template>
  <div class="race">
    <v-container class="px-0" fluid>
      <v-row>
        <v-col lg="4" md="6" cols="12">
          <v-card class="py-2" color="card" elevation="1">
            <v-list class="controls py-0" color="transparent">
              <v-subheader>{{ $t('race.actions') }}</v-subheader>
              <v-list-item>
                <v-list-item-content class="body-2">Force End Race</v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y top nudge-left="50" nudge-top="10">
                    <template v-slot:activator="{ on }">
                      <v-btn color="error" outlined small v-on="on">End Race</v-btn>
                    </template>
                    <v-card color="card">
                      <v-card-text class="py-2 text-center">Please confirm this action</v-card-text>
                      <v-card-actions class="pt-1 pb-2">
                        <v-btn class="mx-auto" color="primary" small text @click="end"
                          >Confirm</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <v-subheader>Create new race</v-subheader>
              <v-list-item>
                <v-list-item-content class="body-2">End Date</v-list-item-content>
                <v-list-item-action class="d-flex flex-row align-center">
                  <v-datetime-picker
                    color="card"
                    okText="Set"
                    :textFieldProps="{ prependIcon: 'mdi-calendar' }"
                    v-model="setEndingAt"
                  >
                    <template v-slot:dateIcon>
                      <v-icon>mdi-calendar</v-icon>
                    </template>
                    <template v-slot:timeIcon>
                      <v-icon>mdi-clock</v-icon>
                    </template>
                  </v-datetime-picker>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Prize Pool</v-list-item-content>
                <v-list-item-action class="d-flex flex-row align-center">
                  <v-text-field
                    type="number"
                    min="0"
                    prepend-icon="mdi-currency-usd"
                    v-model.number="setPrizePool"
                  ></v-text-field>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-menu offset-y top nudge-left="0" nudge-top="10">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      small
                      outlined
                      block
                      v-on="on"
                      :disabled="setPrizePool <= 0"
                      >Create</v-btn
                    >
                  </template>
                  <v-card color="card">
                    <v-card-text class="py-2 text-center">Please confirm this action</v-card-text>
                    <v-card-actions class="pt-1 pb-2">
                      <v-btn class="mx-auto" color="primary" small text @click="create"
                        >Confirm</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <v-card class="py-2" color="card" elevation="1">
            <v-list class="controls py-0" color="transparent">
              <v-subheader>{{ $t('race.information') }}</v-subheader>
              <v-list-item>
                <v-list-item-content class="body-2">Current Prize Pool</v-list-item-content>
                <v-card-actions class="body-2 success--text"
                  >${{ currentPrizePool.toFixed(2) }}</v-card-actions
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Started at</v-list-item-content>
                <v-card-actions class="body-2">
                  {{ new Date(currentStartedAt) | dateFormat('DD.MM.YYYY HH:mm:ss') }}
                </v-card-actions>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="body-2">Ending at</v-list-item-content>
                <v-card-actions class="body-2">
                  {{ new Date(currentEndingAt) | dateFormat('DD.MM.YYYY HH:mm:ss') }}
                </v-card-actions>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col v-for="(item, i) in stats" :key="i" lg="2" md="4" sm="6" cols="12">
          <Stat :title="item.title" :current="item.current" :type="item.type" :raise="item.raise" />
        </v-col>
      </v-row>
    </v-container>
    <Top />
  </div>
</template>

<script src="./race.js"></script>

<style lang="scss" scoped>
.head {
  font-size: 14px;
  color: #474e55;
  line-height: 1.2;
}
</style>
