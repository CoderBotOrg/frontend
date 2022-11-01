<template>
 <div id="app">
  <template v-if="online">
  <router-view />
  </template>
  <template v-else>
    <v-app id="inspire">
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container class="d-flex align-center flex-column">
        <div style="font-size: 24px;"> {{ $t("message.welcome") }} </div>
        <div class="logo">CoderBot</div>
          <p class="text-center">
            {{ $t("message.coderbot_status_offline_1") }}
            <v-icon icon="mdi-wifi-off"></v-icon>
          </p>
          <p class="text-center">
            <v-progress-circular indeterminate :size="64" :width="4"></v-progress-circular>
          </p>
        </v-container>
      </v-main>
    </v-app> 
    <v-row justify="center">
      <v-dialog
        v-model="wait_long"
        persistent
      >
      </v-dialog>
    </v-row>
  </template>
 </div>
</template>
<script>
import image_1 from './assets/images/coderbot_wide1.jpg';

export default {
  name: 'App',
  data() {
    return {
      status: this.$store.getters.status,
      wait_long: false,
      carouselItems: [
        {
          src: image_1,
        },
      ],
    };
  },
  computed: {
    online() {
      return (this.$store.getters.status != null &&
             this.$store.getters.settings != null);
    }
  }
};

</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
