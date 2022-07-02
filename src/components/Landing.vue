<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container class="d-flex align-center flex-column">
        <div style="font-size: 24px;"> {{ $t("message.welcome") }} </div>
        <div class="logo">CoderBot</div>
        <v-col xs12 md8 offset-md2>
          <v-carousel interval="10000" hide-delimiters>
            <v-carousel-item v-for="(item,i) in carouselItems" :key="i" :src="item.src">
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <br>
        <div style="font-size: 18px;"> {{ $t("message.choose_action") }} </div>
        <v-container>
          <v-row>
            <v-col>
              <v-btn color="indigo" to="/program">
                <v-icon icon="mdi-flip-to-front"></v-icon>{{ $t("message.program") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="indigo" target="_blank" href="/docs">
                <v-icon icon="mdi-help"></v-icon>{{ $t("message.docs") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="indigo" to="/control">
                <v-icon icon="mdi-gamepad"></v-icon>{{ $t("message.control") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="indigo" to="/settings">
                <v-icon icon="mdi-cog"></v-icon>{{ $t("message.settings") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import sidebar from '../components/Sidebar';
import image_1 from '../assets/images/coderbot_wide1.jpg';
import image_2 from '../assets/images/coderbot_wide3.jpg';
// import image_3 from '../assets/images/coderbot_wide4.jpg';

export default {
  components: {
    sidebar
  },
  name: 'Landing',
  methods: {
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
  },
  data() {
    return {
      carouselItems: [
        {
          src: image_1,
        },
        {
          src: image_2,
        }
      ],
      drawer: null,
      source: null,
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  font-size: 80px;
  font-family: 'Overpass Mono';
  font-weight: 600;
  letter-spacing: -5px;
  background-color: #070300;
  color: transparent;
  text-shadow: 3px 3px 3px rgba(255, 255, 255, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}
</style>
