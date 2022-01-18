<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-app-bar color="indigo" dark fixed app>
				<v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
				<v-app-bar-title>CoderBot</v-app-bar-title>
			</v-app-bar>
			<v-main>
				<!-- Content -->
			</v-main>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'CoderBot',
	methods: {
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
			drawer: null
		};
	},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
