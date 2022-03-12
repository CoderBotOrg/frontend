<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title>CoderBot</v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <!-- Column A -->
            <v-flex xs12 md6 offset-md3>
              <h3 class="text-xs-left">{{ $t("message.activity_list") }}</h3>
              <p style="text-align: left">
                <v-alert :value="true" type="info" style="font-size:16px">
                  {{ $t("message.activity_tip_1") }}<br>
                  <i18n path="message.activity_list_text_1">
                    <v-icon class="white--text">delete</v-icon>
                    <v-icon class="white--text">edit</v-icon>
                  </i18n>
                </v-alert>
              </p>
              <v-card>
                <v-list>
                  <span v-if="activityList == null || activityList == [] || activityList.length == 0">
                  <i18n path="message.activity_list_text_2" tag="label" for="message.activity_list_create">
                    <a href="#/activity/new">{{ $t("message.activity_list_create") }}</a>
                  </i18n>
                  </span>
                  <template v-for="activity in activityList">
                    <v-list-item :key="activity.el" link>
                      <v-list-item-title ripple @click="goToActivity(activity.name)">
                        <b>{{ activity.name }}</b>
                        <small> {{activity.description}} </small>
                      </v-list-item-title>
                      <v-icon v-if="activity.default">mdi-star</v-icon>
                      <v-btn text icon color="grey darken-1" v-if="activity.stock!=true" ripple @click="confirmDeleteDlg = true">
                        <v-icon>delete</v-icon>
                          <template>
                            <v-row justify="center">
                              <v-dialog
                                v-model="confirmDeleteDlg"
                                persistent
                                max-width="290"
                              >
                                <v-card>
                                  <v-card-title class="text-h5">
                                    {{ $t("message.activity_list_delete_confirm_title") }}
                                  </v-card-title>
                                  <v-card-text>{{ $t("message.activity_list_delete_confirm_text") }}</v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="confirmDeleteDlg = false"
                                    >
                                      {{ $t("message.cancel") }}
                                    </v-btn>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="confirmDeleteDlg = false; deleteActivity(activity.name)"
                                    >
                                      {{ $t("message.ok") }}
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-row>
                          </template>
                        </v-btn>
                      <v-btn text icon color="grey darken-1" ripple :href="'#/activity/edit/'+activity.name">
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import sidebar from '../components/Sidebar';

export default {
  components: {
    sidebar
  },
  name: 'ActivityList',
  mounted() {
    this.getActivities();
  },
  methods: {
    goToActivity(name) {
      this.$router.push({ name: 'activity_open', params: { name } });
    },
    getActivities() {
      // let programList = this.$data.programList
      this.$coderbot.getActivities()
        .then((response) => {
          this.$data.activityList = response.data;
        });
    },
    deleteActivity(name) {
      this.$coderbot.deleteActivity(name).then(() => {
        this.getActivities();
      });
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
  },
  data() {
    return {
      CB: process.env.CB_ENDPOINT + process.env.APIv2,
      activityList: null,
      drawer: null,
      source: null,
      confirmDeleteDlg: null,
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
