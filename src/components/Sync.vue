<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container class="d-flex flex-column">
          <v-row >
            <v-col>
              <h1>Activities</h1>
            </v-col>
          </v-row>
          <v-row v-for="a in activities">
            <v-col>
              {{ a.name }} - {{ a.description }}
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <h1>Programs</h1>
            </v-col>
          </v-row>
          <v-row v-for="p in programs">
            <v-col>
              {{ p.name }} - {{ p.description }}
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <h1>Setting</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              {{ setting?.name }} - {{ setting?.description }}
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script lang="ts">
import sidebar from './Sidebar.vue';

import { Configuration } from "../cloud_api/configuration";
import { RobotSyncApi } from "../cloud_api/api";
import type { Activity as ActivityClass } from "../cloud_api/api";
import type { Program as ProgramClass } from "../cloud_api/api";
import type { Setting as SettingClass } from "../cloud_api/api";

export default {
  components: {
    sidebar
  },
  name: 'Sync',
  mounted() {
    const configuration = new Configuration({
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkNaMVFtVGM1WGZIV2NfQ1dPVG9kcm1QaXZFNFJ2ckFXaFZ3T28yTm85eDAifQ.eyJpc3MiOiJDb2RlckJvdCBDbG91ZCBBUEkiLCJpYXQiOjE2Nzc3MDI4NjIsImV4cCI6MTcwOTIzODg2MiwiYXVkIjoic3QtYXBpLmNvZGVyYm90Lm9yZyIsInN1YiI6ImNvZGVyQGJvdHMuY29kZXJib3Qub3JnIiwiZW1haWwiOiJjb2RlckBib3RzLmNvZGVyYm90Lm9yZyIsInBpY3R1cmUiOiJodHRwczovL3N0LWFwcC5jb2RlcmJvdC5vcmcvcGljdHVyZXMvbm9waWMifQ.UqTs46YmcIyHN13DpqVZjpHgFtDepHO87OKx3uTYQkTpm5Dwx-mw259O39kJ-nDFfHhU8zs37fyZ0AiXDHPQUrrfMHYeUdnznyBF7VGCeWNR0Izebw0dz_RpgdSO0O8BsbqMUuUofoao7g4dDou5mkqWO8bIIgs0SY35LmyIB9yEuSV5ilvz_wakz8rAXD8dSfdrBg31K9QMh05vbyA9Fc8JYvhGFUJi048QEYD8u-jeGQZqrcc8K5gFEW4MuBsv16drTcmrmO7FMy2x_klCeI8PxftG8mhTP3vtST8uFUdnDiaZNJo6YJkGpyBfC5W3rjVlAVF_hlWSHtqgvJKbMA",
      });
      const robotSyncApi = new RobotSyncApi(configuration);
      robotSyncApi.getRobotActivities().then(result => {
        console.log(result.data);
        this.activities = result.data;
      });
      robotSyncApi.getRobotPrograms().then(result => {
        console.log(result.data);
        this.programs = result.data;
      });
      robotSyncApi.getRobotSetting().then(result => {
        console.log(result.data);
        this.setting = result.data;
      });
  },
  methods: {
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
  },
  data() {
    return {
      drawer: null,
      activities: Array<ActivityClass>(),
      programs: Array<ProgramClass>(),
      setting: null as SettingClass | null,
    };
  },
};
</script>
