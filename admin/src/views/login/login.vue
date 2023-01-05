<template>
  <div class="d-flex flex-column justify-center align-center fill-height">
    <div class="text-h2">Please login to continue</div>
    <v-container>
      <v-row justify="center">
        <v-col xl="1" md="2" cols="4" v-for="(item, i) in providers" :key="i">
          <v-btn :color="color(item.name)" :href="authUrl(item.name)" block>
            <v-icon small left>{{`mdi-${item.name}`}}</v-icon>
            {{item.name}}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script src="./login.js"></script>
