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
							<h3 class="text-xs-left">Lista Attività</h3>
							<p style="text-align: left">
								<v-alert :value="true" type="info" style="font-size:16px">
									Qui puoi avviare un'attività salvata, cliccando sul suo nome.<br>
									L'icona <v-icon class="white--text">delete</v-icon> ti permette di eliminarla, mentre cliccando su <v-icon class="white--text">edit</v-icon> puoi modificarla.
								</v-alert>
							</p>
							<v-card>
								<v-list>
									<span v-if="activityList == null || activityList == [] || activityList.length == 0">
										Nessuna Attività, perchè non ne <a href="#/activity/new">crei</a> una nuova?
									</span>
									<template v-for="activity in activityList">
										<v-list-item :key="activity.el">
											<v-list-item-title ripple @click="goToActivity(activity.name)">
												<b>{{ activity.name }}</b>
												<small> {{activity.description}} </small>
											</v-list-item-title>
											<v-btn text icon color="grey darken-1" ripple @click="deleteActivity(activity.name)">
												<v-icon>delete</v-icon>
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
  components: { sidebar },
  name: 'CoderBot',
  mounted() {
    this.getActivities();
  },
  methods: {
    goToActivity: (name) => {
      window.location = `#/activity/open/${name}`;
    },
    getActivities() {
      const axios = this.$axios;
      const { CB } = this.$data;
      // let programList = this.$data.programList
      axios.get(`${CB}/listActivities`)
        .then((response) => {
          this.$data.activityList = response.data;
          console.log(this.$data.activityList);
        });
    },
    deleteActivity(name) {
      const axios = this.$axios;
      const { CB } = this.$data;
      // let programList = this.$data.programList
      axios.post(`${CB}/deleteActivity`, {
        name,
      })
        .then(() => {
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
    };
  },
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
