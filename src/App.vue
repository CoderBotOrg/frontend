<template>
 <div id="app">
  <template v-if="status == 200">
  <router-view />
  </template>
  <template v-else>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container class="d-flex align-center flex-column">
        <div style="font-size: 24px;"> {{ $t("message.welcome") }} </div>
        <div class="logo">CoderBot</div>
        <v-col xs12 md8 offset-md2>
          <v-carousel hide-delimiters>
            <v-carousel-item v-for="(item,i) in carouselItems" :key="i" :src="item.src">
            </v-carousel-item>
          </v-carousel>
        </v-col>
        </v-container>
      </v-main>
    </v-app> 
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
      >
        <v-card>
          <v-card-text>
            <p class="text-center">
            {{ $t("message.coderbot_status_offline_1") }}
            <v-icon large icon="mdi-wifi-off"></v-icon>
          </p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
 </div>
</template>
<script>
import image_1 from './assets/images/coderbot_wide1.jpg';
import image_2 from './assets/images/coderbot_wide3.jpg';

export default {
  data() {
    return {
      drawer: null,
      status: null,
      dialog: true,
      carouselItems: [
        {
          src: image_1,
        },
        {
          src: image_2,
        }
      ],
    };
  },
  name: 'App',
  mounted() {
    this.pollStatus();
    setInterval(() => {
      this.pollStatus();
    }, 1000);
  },
  methods: {
    pollStatus() {
      this.$coderbot.status()
        .then((response) => {
          if (this.status == 0 && response.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_online');
            this.snackbar = true;
          }

          this.statusData = response.data;
          this.status = response.status;
        })
        .catch((error) => {
          // handle error
          console.log(`pollStatus error: ${error}`);

          if (this.status) {
            this.snackText = this.$i18n.t('message.coderbot_offline_2');
            this.snackbar = true;
          }
          this.status = 0;
        });
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
