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
							<h3 class="text-xs-left">Dati Attività </h3>
							<v-form v-model="valid">
								<v-text-field v-model="name" label="Nome" required></v-text-field>
								<v-text-field v-model="description" label="Descrizione"></v-text-field>
							</v-form>
							<v-select v-model="select" :items="viste" label="Vista predefinita" required></v-select>
							<h3 class="text-xs-left">Tipografia </h3>
							<v-slider :label="'Grandezza testo'" v-model="fontSize" :tick-labels="fontSizeLabels" :max="3" step="1" ticks="always" tick-size="3"></v-slider>
							<v-switch :label="`Solo maiuscole`" v-model="capsSwitch"></v-switch>
							<v-switch :label="`Modalità Daltonici`" v-model="daltonicSwitch"></v-switch>
							<v-select v-if="daltonicSwitch" v-model="daltonic" :items="daltonicModes" label="Tipo daltonismo" required></v-select>
							<v-radio-group v-model="bodyFont" column>
								Carattere tipografico dell'interfaccia<br><br>
								<v-radio label="Roboto" value="Roboto"></v-radio>
								<v-radio label="Open Sans" value="OpenSans"></v-radio>
								<v-radio label="Test Me (Altà leggibilità, indicato per dislessia)" value="testme"></v-radio>
								<v-radio label="Open-Dyslexic (Altà leggibilità, indicato per dislessia)" value="open-dys"></v-radio>
							</v-radio-group>
							<v-radio-group v-model="codeFont" column>
								Carattere tipografico del codice (valori, editor di codice)<br><br>
								<v-radio label="Iosevka" value="iosevka"></v-radio>
								<v-radio label="Inconsolata" value="inconsolata"></v-radio>
							</v-radio-group>
						</v-flex>
						<!-- Column B -->
						<v-flex xs12 md6>
							<h3 class="text-xs-left">Lingua</h3>
							<v-select v-model="uiLang" :items="langs" label="Lingua Interfaccia" required></v-select>
							<v-select v-model="blocklyLang" :items="langs" label="Lingua Blocchi" required></v-select>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
		</v-app>
	</div>
</template>
<script>
export default {
	name: 'HelloWorld',
	data() {
		return {
			value: 0,
			fontSize: 1,
			fontSizeLabels: [
				'Piccolo',
				'Medio',
				'Grande',
				'Molto grande'
			],
			capsSwitch: true,
			daltonicSwitch: 0,
			daltonicType: 1,
			daltonicModes: [
				'Deuteranomaly',
				'Protanomaly',
				'Protanopia'
			],
			bodyFont: "Roboto",
			codeFont: "iosevka",
			langs: [
				'Italiano',
				'Inglese'
			],
			uiLang: 'Italiano',
			blocklyLang: 'Inglese',
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
