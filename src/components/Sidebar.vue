<template>
  <div>
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-list dense>
          <v-list-item to="/">
            <template v-slot:prepend>
              <v-icon  icon="mdi-home" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.home") }}</v-list-item-title>
          </v-list-item>
          <v-list-item href="/docs" target="_blank">
            <template v-slot:prepend>
              <v-icon icon="mdi-help" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.docs") }}</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/activity/manage">
            <template v-slot:prepend>
              <v-icon icon="mdi-pencil-box-multiple" size="large"></v-icon>
            </template>
            <v-list-item-title>{{ $t("message.activity_manage") }}</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/program">
            <template v-slot:prepend>
              <v-icon large icon="mdi-flip-to-front" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.program") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/control">
            <template v-slot:prepend>
              <v-icon large icon="mdi-gamepad" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.control") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/gallery">
            <template v-slot:prepend>
              <v-icon large icon="mdi-image-multiple" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.gallery") }}</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/settings">
            <template v-slot:prepend>
              <v-icon large icon="mdi-cog" size="large"></v-icon>
            </template>
            <v-list-item-title class="navEntry">{{ $t("message.settings") }}</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-layout row wrap fill-height>
            <v-col xs12 style="position:absolute; bottom: 1%;">
              <small>
                &nbsp; &copy;2019-2022 - CoderBot.org, UNIMIB.
              </small>
            </v-col>
          </v-layout>
        </v-list>
      </v-navigation-drawer>
  </div>
</template>
<script lang="js">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar',
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
});
</script>
<style scoped>
</style>
