<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container grid-list-md text-xs-center>
          <v-row>
            <!-- Column A -->
            <v-col>
              <h3>{{ $t("message.activity_list") }}</h3>
              <p>
                <v-alert :value="true" type="info">
                  {{ $t("message.activity_tip_1") }}<br>
                  <i18n-t keypath="message.activity_list_text_1">
                    <v-icon class="white--text" icon="mdi-delete"></v-icon>
                    <v-icon class="white--text" icon="mdi-pencil"></v-icon>
                  </i18n-t>
                </v-alert>
              </p>
              <v-card>
                <v-list id="activity_list">
                  <span v-if="activityList == null || activityList == [] || activityList.length == 0">
                  <i18n-t keypath="message.activity_list_text_2" tag="label" for="message.activity_list_create">
                    <a href="#/activity/new">{{ $t("message.activity_list_create") }}</a>
                  </i18n-t>
                  </span>
                  <template v-for="activity in activityList" :key="activity.el">
                    <v-list-item link :id="activity.name">
                      <div @click="goToActivity(activity.name)">
                      <v-list-item-title>
                        {{ activity.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ activity.description }}
                      </v-list-item-subtitle>
                      </div>
                      <template v-slot:append>
                      <v-btn color="grey" variant="text" v-if="activity.stock!=true" ripple @click="confirmDeleteDlg = true">
                        <v-icon icon="mdi-delete"></v-icon>
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
                                      id="confirmDeleteDlg_ok"
                                    >
                                      {{ $t("message.ok") }}
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-row>
                      </v-btn>
                      <v-btn variant="text" ripple :href="'#/activity/edit/'+activity.name">
                        <v-icon icon="mdi-pencil"></v-icon>
                      </v-btn>
                      </template>
                      <template v-slot:prepend>
                        <v-icon v-if="activity.default" icon="mdi-star"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-list>
                <v-card-actions>
                  <v-btn to="/activity/new">
                  <v-icon icon="mdi-plus-box-multiple" size="large"></v-icon>
                  {{ $t("message.activity_new") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script lang="js">
import sidebar from './Sidebar.vue';

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
