<template>
  <div>
    <template v-if="mobileDrawAnim == '1'">
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-list dense>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon large>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.home") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="/docs" target="_blank">
            <v-list-item-action>
              <v-icon large>help</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.docs") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!--
				<v-list-item to="/help">
					<v-list-item-action>
						<v-icon large>help</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title class="navEntry">Aiuto</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			-->
          <br>
          <v-divider>
          </v-divider>
          <br>
          <!--
				<v-list-item to="/activity">
					<v-list-item-action>
						<v-icon>open_in_new</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Apri Attività</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item to="/new">
					<v-list-item-action>
						<v-icon>add</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Nuova Attività</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				-->
          <h3>{{ $t("message.activity_title") }}</h3>
          <v-list-item to="/activity/open">
            <v-list-item-action>
              <v-icon>open_in_new</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t("message.activity_open") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/activity/new">
            <v-list-item-action>
              <v-icon>add</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t("message.activity_new") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <br>
          <v-divider>
          </v-divider>
          <br>
          <v-list-item to="/program">
            <v-list-item-action>
              <v-icon large>flip_to_front</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.program") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/control">
            <v-list-item-action>
              <v-icon large>games</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.control") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-action>
              <v-icon large>settings</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.settings") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/gallery">
            <v-list-item-action>
              <v-icon large>photo_library</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.gallery") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <br>
          <v-layout row wrap fill-height>
            <v-flex xs12 style="position:absolute; bottom: 1%;">
              <small>
                &nbsp; &copy;2019-2022 - CoderBot.org, UNIMIB.
                <!-- — <router-link to="/credits"><a>Credits</a></router-link>-->
              </small>
            </v-flex>
          </v-layout>
        </v-list>
      </v-navigation-drawer>
    </template>
    <template v-else>
      <v-navigation-drawer fixed v-model="drawer" app :mobile-breakpoint="0">
        <v-list dense>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon large>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.home") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="/docs" target="_blank">
            <v-list-item-action>
              <v-icon large>help</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.docs") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!--
				<v-list-item to="/help">
					<v-list-item-action>
						<v-icon large>help</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title class="navEntry">Aiuto</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			-->
          <br>
          <v-divider>
          </v-divider>
          <br>
          <!--
				<v-list-item to="/activity">
					<v-list-item-action>
						<v-icon>open_in_new</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Apri Attività</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			-->
          <h3>{{ $t("message.activity_title") }}</h3>
          <v-list-item to="/activity/open">
            <v-list-item-action>
              <v-icon>open_in_new</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t("message.activity_open") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/activity/new">
            <v-list-item-action>
              <v-icon>add</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t("message.activity_new") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <br>
          <v-divider>
          </v-divider>
          <br>
          <v-list-item to="/program">
            <v-list-item-action>
              <v-icon large>flip_to_front</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.program") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/control">
            <v-list-item-action>
              <v-icon large>games</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.control") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-action>
              <v-icon large>settings</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.settings") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/gallery">
            <v-list-item-action>
              <v-icon large>photo_library</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="navEntry">{{ $t("message.gallery") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <br>
          <v-layout row wrap fill-height>
            <v-flex xs12 style="position:absolute; bottom: 1%;">
              <small>
                &nbsp; &copy;2019 - CoderBot.org, UNIMIB.
                <!-- — <router-link to="/credits"><a>Credits</a></router-link>-->
              </small>
            </v-flex>
          </v-layout>
          <div>
            <!--
						<v-btn v-for="el in socials" :key="el.icon" class="mx-3 gray--text" icon :href="el.link" target="_blank">
							<v-icon size="24px">{{ el.icon }}</v-icon>
						</v-btn>-->
            <br>
            <center>
            </center>
          </div>
        </v-list>
      </v-navigation-drawer>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      socials: [
        {
          icon: 'fab fa-facebook',
          link: 'https://facebook.com/coderbot'
        },
        {
          icon: 'fab fa-twitter',
          link: 'https://twitter.com/coderbotorg'
        },
        {
          icon: 'fab fa-instagram',
          link: 'https://www.instagram.com/coderbotorg/'
        },
        {
          icon: 'fab fa-github',
          link: 'https://www.github.com/coderbotorg'
        },
      ],
    };
  },
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
  props: {
    mobileDrawAnim: {
      type: String,
      default: '1',
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
