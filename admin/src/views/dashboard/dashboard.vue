<template>
  <div class="dashboard">
    <v-container class="px-0" fluid>
      <v-alert class="text-center" text color="info" dense>
        <div class="body-2">
          <span class="font-weight-bold text-decoration-underline">Crash is live!</span> Therefore watch out for player
          <span class="font-weight-medium">questions</span> and
          <span class="font-weight-medium">bug reports</span>.
        </div>
        <div class="body-2">
          We removed
          <span class="font-weight-bold">King</span> due to possible bugs and lack of activity.
        </div>
      </v-alert>
      <v-row justify="space-between">
        <v-col v-for="(item, i) in mainStats" :key="i" lg="3" md="4" sm="6" cols="12">
          <Stat
            :title="i"
            :totalValueToday="item.totalValueToday"
            :graphData="item.graphData"
            :isRising="item.isRising"
            :isFloat="item.isFloat"
            :loading="loading"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="4" md="6" cols="12">
          <v-skeleton-loader :loading="loading" type="image">
            <v-card color="card" elevation="1">
              <v-list class="controls" color="transparent">
                <v-subheader>{{ $t('dashboard.controls.gameActions.title') }}</v-subheader>
                <v-list-item>
                  <v-list-item-content>Crash</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('crash')"
                      v-model="controls.gamesEnabled.crashEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Cups</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('cups')"
                      v-model="controls.gamesEnabled.cupsEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Shuffle</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('shuffle')"
                      v-model="controls.gamesEnabled.shuffleEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Roulette</v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('roulette')"
                      v-model="controls.gamesEnabled.rouletteEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <v-skeleton-loader :loading="loading" type="image">
            <v-card color="card" elevation="1">
              <v-list class="controls" color="transparent">
                <v-subheader>{{ $t('dashboard.controls.general.title') }}</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    {{
                    $t('dashboard.controls.general.maintenance')
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('maintenance')"
                      v-model="controls.maintenanceEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    {{
                    $t('dashboard.controls.general.login')
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('login')"
                      v-model="controls.loginEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <v-skeleton-loader :loading="loading" type="image">
            <v-card color="card" elevation="1">
              <v-list class="controls" color="transparent">
                <v-subheader>{{ $t('dashboard.controls.transactionSettings.title') }}</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    {{
                    $t('dashboard.controls.transactionSettings.deposits')
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('deposit')"
                      v-model="controls.depositsEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    {{
                    $t('dashboard.controls.transactionSettings.withdrawals')
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      color="success"
                      dense
                      inset
                      small
                      @change="toggle('withdraw')"
                      v-model="controls.withdrawsEnabled"
                    ></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    {{
                    $t('dashboard.controls.transactionSettings.coupons')
                    }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch color="success" dense inset small></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="title" cols="12">Games</v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col v-for="(item, i) in gameStats" :key="i" md="6" cols="12">
          <Stat
            :title="i"
            :totalValueToday="item.totalValueToday"
            :graphData="item.graphData"
            :isRising="item.isRising"
            :isFloat="item.isFloat"
            :loading="loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script src="./dashboard.js"></script>

<style lang="scss" scoped>
.controls {
  .v-subheader {
    font-size: 14px;
    color: #474e55;
    line-height: 1.2;
  }

  .v-list-item__content {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
  }
}
</style>
