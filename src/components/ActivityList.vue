<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>CoderBot</v-toolbar-title>
			</v-toolbar>
			<v-content>
				<v-list>
					<span v-if="activityList == null">
						Nessuna Attività, perchè non ne <a href="#/activity/new">crei</a> una nuova?
					</span>
						<v-list-tile v-for="activity in activityList" :key="activity.el" avatar @click="">
							<v-list-tile-title ripple @click="loadProgram(activity.name)">
								{{ activity.name }}
							</v-list-tile-title>
							<v-btn flat icon color="grey darken-1" ripple @click="deleteActivityDlg(activity.name)">
								<v-icon>delete</v-icon>
							</v-btn>
						</v-list-tile>
					</v-list>
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
		let axios = this.$axios
		let CB = this.$data.CB
		//let programList = this.$data.programList
		axios.get(CB + '/listActivities')
			.then(function(response) {
					this.$data.activityList = response.data;
			}.bind(this))
	},
	methods: {
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
