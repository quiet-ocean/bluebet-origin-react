<template>
  <div>
    <Sidebar />
    <v-content>
      <v-container class="main-container" fluid>
        <Navbar />
        <v-slide-x-transition hide-on-leave>
          <router-view class="py-10" />
        </v-slide-x-transition>
      </v-container>
    </v-content>
  </div>
</template>

<script src="./layout.js"></script>
