<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>CoderBot</v-toolbar-title>
			</v-toolbar>
			<v-content>
				<p class="display-3"> Benvenuto in CoderBot </p>
				<p class="display-1"> Scegli un'azione per iniziare </p>
				<v-container grid-list-md text-xs-center>
					<v-layout row wrap>
						<v-flex xs12 md6 offset-md3>
							
							<v-btn flat large color="primary" to="program">
								<v-icon left dark>flip_to_front</v-icon>Programma
							</v-btn> <br>
							<v-btn flat large color="primary" to="control">
								<v-icon left dark>games</v-icon>Controlla
							</v-btn> <br>
							<!--
							<v-btn flat large color="primary">
								<v-icon left dark>open_in_new</v-icon>Apri Attività
							</v-btn> <br>
							<v-btn flat large color="primary" to="new">
								<v-icon left dark>add</v-icon>Nuova Attività
							</v-btn> <br>
							-->
							<v-btn flat large color="primary" to="settings">
								<v-icon left dark>settings</v-icon>Impostazioni
							</v-btn> <br>
							<!--
							<v-btn flat large color="primary">
								<v-icon left dark>help</v-icon>Aiuto
							</v-btn> <br>
							-->
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
			source: null,
			msg: 'Welcome to Your Vue.js App',
		};
	},
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
