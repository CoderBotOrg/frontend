<template>
	<div>
		<v-navigation-drawer fixed v-model="drawer" app>
			<v-list dense>
				<v-list-tile to="/">
					<v-list-tile-action>
						<v-icon large>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="navEntry">Home</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<!--
				<v-list-tile to="/activity">
					<v-list-tile-action>
						<v-icon>open_in_new</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Apri Attività</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile to="/new">
					<v-list-tile-action>
						<v-icon>add</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Nuova Attività</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				-->
				<v-list-tile to="/program">
					<v-list-tile-action>
						<v-icon large>flip_to_front</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="navEntry">Programma</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile to="/control">
					<v-list-tile-action>
						<v-icon large>games</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="navEntry">Controlla</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile to="/settings">
					<v-list-tile-action>
						<v-icon large>settings</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="navEntry">Impostazioni</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<br><br><br>
				<div style="position: absolute; bottom: 1%;" class="gray--text text-xs-center">
					<v-divider></v-divider>
					<v-btn v-for="el in socials" :key="el.icon" class="mx-3 gray--text" icon :href="el.link" target="_blank">
						<v-icon size="24px">{{ el.icon }}</v-icon>
					</v-btn>
					<br>
					&copy;2018 — <strong>UNIMIB</strong>
				</div>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>
<script>
export default {
	data() {
		return {
			socials: [
				{ icon: 'fab fa-facebook', link: 'https://facebook.com/coderbot' },
				{ icon: 'fab fa-twitter', link: 'https://twitter.com/coderbotorg' },
				{ icon: 'fab fa-instagram', link: 'https://www.instagram.com/coderbotorg/' },
				{ icon: 'fab fa-github', link: 'https://www.github.com/coderbotorg' },
			],
		}
	},
	computed: {
		drawer: {
			get() {
				return this.$store.state.drawer
			},
			set(val) {
				this.$store.commit('toggleDrawer', val)
			}
		}
	}
}

</script>
<style scoped>
.navEntry{
	font-size: 15px;
}
</style>