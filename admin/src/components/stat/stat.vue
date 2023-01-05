<template>
  <v-skeleton-loader :loading="loading" height="150" type="card">
    <v-card color="card" elevation="1">
      <div class="px-6 pt-4">
        <div class="head">{{ title.replace('Statistics', '') | capitalize }}</div>
        <div class="current d-flex align-center">
          {{ isFloat ? totalValueToday.toFixed(2) : totalValueToday }}
          <v-icon :color="isRising ? 'success' : 'error'">
            {{
            isRising ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}
          </v-icon>
        </div>
      </div>
      <v-sparkline
        v-if="graphData"
        :value="graphData.data"
        color="yellow"
        :gradient="gradient"
        fill
        height="105px"
        line-width="3"
      ></v-sparkline>
    </v-card>
  </v-skeleton-loader>
</template>

<script src="./stat.js"></script>

<style lang="scss" scoped>
.head {
  color: #484f56;
  font-size: 15px;
}

.current {
  font-size: 23px;
  font-weight: 500;
}

.head,
.current {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
</style>
