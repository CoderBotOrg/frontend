<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>Crediti</v-toolbar-title>
			</v-toolbar>
			<v-content>Placeholder content</v-content>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	methods: {
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
			drawer: null,
		};
	},
};

</script>
