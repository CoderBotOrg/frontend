<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>CoderBot</v-toolbar-title>
			</v-toolbar>
			<v-content>
				<v-container grid-list-md text-xs-center>
					<v-layout row wrap>
						<!-- Column A -->
						<v-flex xs12 md6 offset-md3>
							<h3 class="text-xs-left">Lista Attività</h3>
							<p style="text-align: left">
								Qui puoi avviare un'attività salvata, cliccando sul suo nome.<br>
								L'icona <v-icon>delete</v-icon> ti permette di eliminarla, mentre cliccando su <v-icon>edit</v-icon> puoi modificarla.
							</p>
							<v-card>
								<v-list>
									<span v-if="activityList == null || activityList == [] || activityList.length == 0">
										Nessuna Attività, perchè non ne <a href="#/activity/new">crei</a> una nuova?
									</span>
									<template v-for="activity in activityList">
										<v-list-tile :key="activity.el" avatar @click="">
											<v-list-tile-title ripple @click="goToActivity(activity.name)">
												<b>{{ activity.name }}</b>
												<small> {{activity.description}} </small>
											</v-list-tile-title>
											<v-btn flat icon color="grey darken-1" ripple @click="deleteActivity(activity.name)">
												<v-icon>delete</v-icon>
											</v-btn>
											<v-btn flat icon color="grey darken-1" ripple :href="'#/activity/edit/'+activity.name">
												<v-icon>edit</v-icon>
											</v-btn>
										</v-list-tile>
									</template>
								</v-list>
							</v-card>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"
export default {
	components: { sidebar },
	name: 'CoderBot',
	mounted() {
		this.getActivities();
	},
	methods: {
		goToActivity: (name) => {
			window.location = '#/activity/open/' + name
		},
		getActivities: function() {
			let axios = this.$axios
			let CB = this.$data.CB
			//let programList = this.$data.programList
			axios.get(CB + '/listActivities')
				.then(function(response) {
					this.$data.activityList = response.data;
					console.log(this.$data.activityList)
				}.bind(this))
		},
		deleteActivity: function(name) {
			let axios = this.$axios
			let CB = this.$data.CB
			//let programList = this.$data.programList
			axios.post(CB + '/deleteActivity', {
					name: name
				})
				.then(function(response) {
					this.getActivities();
				}.bind(this))
		},
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
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
