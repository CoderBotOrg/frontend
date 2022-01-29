<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title>CoderBot</v-app-bar-title>
      </v-app-bar>
      <v-main>
        <br>
        <div style="font-size: 24px;"> {{ $t("message.welcome") }} </div>
        <div class="logo">CoderBot</div>
        <v-flex xs12 md8 offset-md2>
          <v-carousel interval="10000" hide-delimiters>
            <v-carousel-item v-for="(item,i) in carouselItems" :key="i" :src="item.src">
            </v-carousel-item>
          </v-carousel>
        </v-flex>
        <br>
        <div style="font-size: 18px;"> {{ $t("message.choose_action") }} </div>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex xs12 md6 offset-md3>
              <v-btn text large color="primary" to="program">
                <v-icon left dark>flip_to_front</v-icon>{{ $t("message.program") }}
              </v-btn> <br>
              <v-btn text large color="primary" target="_blank" href="/docs">
                <v-icon left dark>help</v-icon>{{ $t("message.docs") }}
              </v-btn> <br>
              <v-btn text large color="primary" to="control">
                <v-icon left dark>games</v-icon>{{ $t("message.control") }}
              </v-btn> <br>
              <!--
							<v-btn text large color="primary">
								<v-icon left dark>open_in_new</v-icon>Apri Attività
							</v-btn> <br>
							<v-btn text large color="primary" to="new">
								<v-icon left dark>add</v-icon>Nuova Attività
							</v-btn> <br>
							-->
              <v-btn text large color="primary" to="settings">
                <v-icon left dark>settings</v-icon>{{ $t("message.settings") }}
              </v-btn> <br>
              <!--
							<v-btn text large color="primary">
								<v-icon left dark>help</v-icon>Aiuto
							</v-btn> <br>
							-->
            </v-flex>
          </v-layout>
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
  name: 'CoderBot',
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
