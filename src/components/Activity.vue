<template>
	<div>
		<v-app id="inspire">
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
				</v-list>
			</v-navigation-drawer>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<v-toolbar-title>Nuova Attività</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat>
						<v-icon>save</v-icon>
						Salva
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-content>
				<v-container grid-list-md text-xs-center>
					<v-layout row wrap>
						<!-- Column A -->
						<v-flex xs12 md6>
							<h2 class="text-xs-left">Dati Progetto </h2>
							<v-form v-model="valid">
								<v-text-field v-model="name" label="Nome" required></v-text-field>
								<v-text-field v-model="description" label="Descrizione"></v-text-field>
							</v-form>
							<v-select v-model="select" :items="viste" label="Vista predefinita" required></v-select>
							<h2 class="text-xs-left">Tipografia </h2>
						</v-flex>
						<!-- Column B -->
						<v-flex xs12 md6>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
			</v-content>
		</v-app>
	</div>
</template>
<script>
export default {
	name: 'HelloWorld',
	data() {
		return {
			drawer: null,
			source: null,
			msg: 'Welcome to Your Vue.js App',
			viste: [
				{ text: 'Esecuzione', value: 'exec', },
				{ text: 'Blocchi', value: 'blocks' },
				{ text: 'Python', value: 'python', disabled: true }
			],
		};
	},
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
