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
							<v-layout row wrap>
							  <v-flex>
							    <v-switch :label="`Modalità Daltonici`" v-model="daltonicSwitch"></v-switch>
							  </v-flex>
							  <v-flex >
							    <v-select v-if="daltonicSwitch" v-model="daltonic" :items="daltonicModes" label="Tipo daltonismo" required></v-select>
							  </v-flex>
							</v-layout>
							
							
							<span v-bind:style="bodyUIstyleObj">Lorem Ipsum e robbe varie</span>
							<v-radio-group v-model="bodyFont" column>
								Carattere tipografico dell'interfaccia<br><br>
								<v-radio label="Roboto" value="Roboto"></v-radio>
								<v-radio label="Open Sans" value="opensans"></v-radio>
								<v-radio label="Test Me (Altà leggibilità, indicato per dislessia)" value="testme"></v-radio>
								<v-radio label="Open-Dyslexic (Altà leggibilità, indicato per dislessia)" value="open-dys"></v-radio>
							</v-radio-group>
							<span v-bind:style="codeUIstyleObj">function life() { return 42; }</span>
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
							<br>
							<h3 class="text-xs-left">Viste disponibili</h3>
							<v-layout row wrap>
								<v-flex>
									<v-checkbox v-model="availableViews" label="Programmazione a Blocchi" value="blockly"></v-checkbox>
								</v-flex>
								<v-flex>
									<v-checkbox disabled v-model="availableViews" label="Editor Python" value="python"></v-checkbox>
								</v-flex>
								<v-flex>
									<v-checkbox v-model="availableViews" label="Visuale di Esecuzione" value="runtime"></v-checkbox>
								</v-flex>
							</v-layout>
							<v-switch :label="`Permetti di visualizzare il codice generato`" v-model="capsSwitch"></v-switch>
							<br><br>
							<h3 class="text-xs-left">Funzionalità sperimentali</h3>
							<v-switch color="orange darken-3" :label="`Abilità funzionalità sperimentali`" v-model="experimental"></v-switch>
							<v-layout row wrap>
								<v-flex>
									<v-switch v-if="experimental" :label="`Cronologia Modifiche`" v-model="editHistory"></v-switch>
								</v-flex>
								<v-flex>
									<v-switch v-if="editHistory" :label="`Permetti navigazione nella cronologia modifiche`" v-model="navHistory"></v-switch>
								</v-flex>
							</v-layout>
							<v-switch v-if="experimental" :label="`Esecuzione passo passo`" v-model="stepbystep"></v-switch>
							<v-switch disabled v-if="experimental" :label="`Realtà Aumentata`" v-model="ar"></v-switch>
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
	computed: {
		bodyUIstyleObj: function() {
			let bodyFont = this.$data.bodyFont
			let fontFamily = ''
			if (bodyFont == 'opensans')
				fontFamily = 'Open Sans'
			else if (bodyFont == 'roboto')
				fontFamily = 'Roboto'

			let obj = {
				fontSize: '36px',
				fontFamily,
				backgroundColor: ''
			}
			
			return obj
		},
		codeUIstyleObj: function() {
			let codeFont = this.$data.codeFont
			let fontFamily = ''
			if (codeFont == 'iosevka')
				fontFamily = 'Iosevka'
			else if (codeFont == 'inconsolata')
				fontFamily = 'hack'

			let obj = {
				fontSize: '28px',
				fontFamily,
				backgroundColor: '',
			}
			
			return obj
		},		

	},
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
			availableViews: [],
			editHistory: false,
			navHistory: false,
			experimental: true,
			stepbystep: false,
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
