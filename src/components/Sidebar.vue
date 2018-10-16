<template>
	<div>
		<v-navigation-drawer fixed v-model="drawer" app>
			<v-list dense>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Home</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				Utente
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>account_box</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Luigi Beretta</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>exit_to_app</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Logout</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				Attività
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>add</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Nuova</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>open_in_new</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Apri</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>close</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Chiudi</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				Altro
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>settings</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Impostazioni</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<br><br><br>
				
				<div style="position: absolute; bottom: 1%;" class="gray--text text-xs-center">
					<v-divider></v-divider>
					<v-btn v-for="icon in icons" :key="icon" class="mx-3 gray--text" icon>
						<v-icon size="24px">{{ icon }}</v-icon>
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
			icons: [
				'fab fa-facebook',
				'fab fa-twitter',
				'fab fa-instagram',
				'fab fa-github',
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
