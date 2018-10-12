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
				<v-toolbar-title>Impostazioni</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat>
						<v-icon>save</v-icon>
						Salva
					</v-btn>
				</v-toolbar-items>
				<v-tabs slot="extension" v-model="tab" centered color="transparent" slider-color="white">
					<v-tab v-for="item in tabs" :key="item">
						{{ item }}
					</v-tab>
				</v-tabs>
			</v-toolbar>
			<v-content>
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<br>
							<v-btn color="info">Spegni</v-btn>
							<v-btn color="info">Riavvia</v-btn>
							<v-btn color="warning">Aggiorna</v-btn>
						
					</v-tab-item>
					<v-tab-item>
						2
					</v-tab-item>
					<v-tab-item>
						Tab 3
					</v-tab-item>
					<v-tab-item>
						Tab 4
					</v-tab-item>
				</v-tabs-items>
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
			tab: null,
			tabs: ['Generali'],
		}
	}
}

</script>
