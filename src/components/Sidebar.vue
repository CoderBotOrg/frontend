<template>
  <div>
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-list dense>
          <v-list-item to="/">
            <v-list-item-avatar>
              <v-icon  icon="mdi-home" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.home") }}</v-list-item-title>
          </v-list-item>
          <v-list-item href="/docs" target="_blank">
            <v-list-item-avatar>
              <v-icon icon="mdi-help" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.docs") }}</v-list-item-title>
          </v-list-item>
          <br>
          <v-divider>
            {{ $t("message.activity_title") }}
          </v-divider>
          <v-list-item to="/activity/manage">
            <v-list-item-avatar>
              <v-icon icon="mdi-pencil-box-multiple" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t("message.activity_manage") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/activity/new">
            <v-list-item-avatar>
              <v-icon icon="mdi-plus-box-multiple" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t("message.activity_new") }}</v-list-item-title>
          </v-list-item>
          <v-divider>
          </v-divider>
          <br>
          <v-list-item to="/program">
            <v-list-item-avatar>
              <v-icon large icon="mdi-flip-to-front" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.program") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/control">
            <v-list-item-avatar>
              <v-icon large icon="mdi-gamepad" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.control") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-avatar>
              <v-icon large icon="mdi-cog" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.settings") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/gallery">
            <v-list-item-avatar>
              <v-icon large icon="mdi-image-multiple" size="large"></v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="navEntry">{{ $t("message.gallery") }}</v-list-item-title>
          </v-list-item>
          <br>
          <v-layout row wrap fill-height>
            <v-col xs12 style="position:absolute; bottom: 1%;">
              <small>
                &nbsp; &copy;2019-2022 - CoderBot.org, UNIMIB.
                <!-- — <router-link to="/credits"><a>Credits</a></router-link>-->
              </small>
            </v-col>
          </v-layout>
        </v-list>
      </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  name: 'Sidebar',
  methods: {
    editModal() {
      const axios = this.$axios;
      const {
        CB
      } = this.$data;
      // let programList = this.$data.programList
      axios.get(`${CB}/listActivities`)
        .then((response) => {
          this.$data.editModal = true;
          this.$data.activitiesList = response.data;
        });
    },
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit('toggleDrawer', val);
      },
    },
  },
};
</script>
<style scoped>
</style>
