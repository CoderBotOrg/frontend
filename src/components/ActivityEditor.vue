<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title v-if="!saved">Nuova Attività {{prefix}} {{activity.name}}</v-toolbar-title>
				<v-toolbar-title v-else>Modifica Attività {{prefix}} {{activity.name}}</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat @click="save()">
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
						<v-container grid-list-md text-xs-center>
							<v-layout row wrap>
								<!-- Column A -->
								<v-flex xs12 md6 offset-md3>
									<h3 class="text-xs-left">Dati Attività </h3>
									<v-card>
										<v-form class="cardContent">
											<v-text-field v-model="activity.name" label="Nome" required></v-text-field>
											<v-text-field v-model="activity.description" label="Descrizione"></v-text-field>
											<v-select v-model="defaultView" :items="viste" label="Vista predefinita" required></v-select>
										</v-form>
									</v-card>
									<br><br>
									<h3 class="text-xs-left">Tipografia </h3>
									<v-card>
										<div class="cardContent">
											<!--
											<v-select :items="fontSizeLabels" v-model="activity.fontSize" label="Grandezza testo"></v-select>
										-->
											<v-switch :label="`Solo maiuscole`" v-model="activity.capsSwitch"></v-switch>
											<!--
											<v-layout row wrap>
												<v-flex>
													<v-switch :label="`Modalità Daltonici`" v-model="daltonicSwitch"></v-switch>
												</v-flex>
												<v-flex>
													<v-select v-if="daltonicSwitch" v-model="daltonic" :items="daltonicModes" label="Tipo daltonismo" required></v-select>
												</v-flex>
											</v-layout>
										-->
										</div>
									</v-card>
									<br><br>
									<h3 class="text-xs-left">Carattere tipografico dell'interfaccia</h3>
									<v-card>
										<div class="cardContent">
											<span v-bind:style="bodyUIstyleObj">Lorem ipsum dolor sit amet</span>
											<v-radio-group v-model="activity.bodyFont" column>
												<v-radio label="Roboto" value="Roboto"></v-radio>
												<v-radio label="Open Sans" value="opensans"></v-radio>
												<!--
												<v-radio label="Test Me (Altà leggibilità, indicato per dislessia)" value="testme"></v-radio>
												<v-radio label="Open-Dyslexic (Altà leggibilità, indicato per dislessia)" value="open-dys"></v-radio>
											-->
											</v-radio-group>
										</div>
									</v-card>
									<br><br>
									<h3 class="text-xs-left">Carattere tipografico del codice (valori, editor di codice)</h3>
									<v-card>
										<div class="cardContent">
											<span v-bind:style="codeUIstyleObj">function life() { return 42; }</span>
											<v-radio-group v-model="activity.codeFont" column>
												<v-radio label="Ubuntu Mono" value="ubuntumono"></v-radio>
												<v-radio label="Roboto Mono" value="robotomono"></v-radio>
											</v-radio-group>
										</div>
									</v-card>
									<br><br>
									<!--
									<h3 class="text-xs-left">Lingua</h3>
									<v-card>
										<div class="cardContent">
											<v-select v-model="uiLang" :items="langs" label="Lingua Interfaccia" required></v-select>
											<v-select v-model="blocklyLang" :items="langs" label="Lingua Blocchi" required></v-select>
										</div>
									</v-card>
									<br><br>
								-->
									<!--
									<h3 class="text-xs-left">Viste disponibilità</h3>
									<v-card>
										<div class="cardContent">
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

												<v-switch :label="`Permetti di visualizzare il codice generato`" v-model="capsSwitch"></v-switch>
											</v-layout>
										</div>
									</v-card>
									-->
									<br><br>
									<!--
									<h3 class="text-xs-left">Funzionalità sperimentali</h3>
									<v-card>
										<div class="cardContent">
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
										</div>
									</v-card>
								-->
								</v-flex>
							</v-layout>
						</v-container>
					</v-tab-item>
					<v-tab-item>
						<v-container grid-list-md text-xs-center>
							<v-flex xs12 md8 offset-md2>
								<v-flex>
									<h3> Anteprima Toolbar </h3>
									<v-toolbar>
										<v-toolbar-side-icon v-if="activity.drawerEnabled"></v-toolbar-side-icon>
										<v-toolbar-title v-if="activity.showName">Attività 1</v-toolbar-title>
										<v-spacer></v-spacer>
										<v-toolbar-items>
											<template v-for="button, i in activity.buttons">
												<v-btn style="height: 70%" :color="button.colorBtn" :class="button.colorText">
													{{ button.label }}
													<v-icon right dark>{{ button.icon }}</v-icon>
												</v-btn>
												&nbsp;&nbsp;
											</template>
										</v-toolbar-items>
									</v-toolbar>
									<br>
									<v-switch label="Icona menù laterale" v-model="activity.drawerEnabled"></v-switch>
									<v-switch label="Nome Attività" v-model="activity.showName"></v-switch>
									<br>
									<h3> Modifica Pulsanti </h3>
									<v-btn @click="addButton()" outline color="green">
										<v-icon>add</v-icon> Aggiungi
									</v-btn>
									<v-btn @click="restoreDefaults()" outline color="blue">
										<v-icon>undo</v-icon> Predefiniti
									</v-btn>
									<v-btn @click="removeAll()" outline color="red">
										<v-icon>clear</v-icon> Rimuovi tutti
									</v-btn>
									<br><br>
									<div v-for="button, i in activity.buttons">
										<h3>Pulsante {{i + 1}}
											<v-btn @click="removeButton(i)" flat icon v-if="!button.notErasable">
													<v-icon>clear</v-icon>
												</v-btn></h3>
										<v-card>
											<div class="cardContent">
												<span class="grey--text text--darken-2" v-if="button.notErasable"> "Esegui" non può essere eliminato </span>
												<v-text-field v-model="button.label" label="Etichetta"></v-text-field>
												<v-select v-model="button.action" :items="actions" label="Azione" :disabled="button.notErasable">
												</v-select>
												<v-select :items="textColors" v-model="button.colorText" label="Colore testo"></v-select>
												Colore Pulsante <swatches v-model="button.colorBtn"></swatches>
												<v-text-field v-model="button.icon" label="Icona"></v-text-field>
												<v-divider></v-divider>
												<v-btn :color="button.colorBtn" :class="button.colorText">
													{{ button.label }}
													<v-icon right dark>{{ button.icon }}</v-icon>
												</v-btn>
											</div>
										</v-card>
										<br>
									</div>
								</v-flex>
							</v-flex>
						</v-container>
					</v-tab-item>
					<!--
					<v-tab-item>
						<wsFactory />
					</v-tab-item>
				-->
					<v-tab-item>
						<v-container grid-list-md text-xs-center>
							<v-layout row wrap>
								<!-- Column A -->
								<v-flex xs12 md6 offset-md3>
									<h3 class="text-xs-left">Viste</h3>
									<v-card>
										<v-form class="cardContent">
											<v-switch label="Camera" v-model="activity.exec.camera"></v-switch>
											<v-switch label="Log" v-model="activity.exec.log"></v-switch>
										</v-form>
									</v-card>
								</v-flex>
							</v-layout>
						</v-container>
					</v-tab-item>
					</v-tab-item>
				</v-tabs-items>
			</v-content>
		</v-app>
		<v-snackbar v-model="snackbar">
			{{ snackbarText }}
		</v-snackbar>
	</div>
</template>
<script>
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"

import wsFactory from "../components/wsFactory"
import sidebar from "../components/Sidebar"

export default {
	name: 'ActivityEditor',
	components: { Swatches, wsFactory, sidebar },
	computed: {
		prefix: function() {
			console.log(this.name)
			if (this.activity.name != null && this.activity.name != '')
				return '-'
			else
				return ''
		},
		bodyUIstyleObj: function() {
			let bodyFont = this.activity.bodyFont
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
			let codeFont = this.activity.codeFont
			let fontFamily = ''
			if (codeFont == 'ubuntumono')
				fontFamily = 'Ubuntu Mono'
			else if (codeFont == 'robotomono')
				fontFamily = 'Roboto Mono'

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
			saved: false,
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			snackbar: false,
			snackbarText: "",
			activity: {
				exec: {
					camera: true,
					log: true
				},
				name: null,
				drawerEnabled: true,
				showName: true,
				buttons: null,
				description: null,
				fontSize: 'Medio',
				capsSwitch: true,
				bodyFont: "Roboto",
				codeFont: "ubuntumono",

			},
			colors: ['red', 'pink', 'purple', 'yellow', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'black', 'grey', 'black', 'white'],
			textColors: [{
					text: "Bianco",
					value: 'white--text'
				},
				{
					text: "Nero",
					value: 'black--text'
				}
			],
			actions: [
				{ text: 'Esegui', value: 'runProgramLegacy' },
				{ text: 'Salva', value: 'saveProgram' },
				{ text: 'Carica Programma', value: 'loadProgramList' },
				{ text: 'Esporta', value: 'exportProgram' },
				{ text: 'Importa', value: 'pickFile' },
				{ text: 'Salva con Nome', value: 'toggleSaveAs' },
				{ text: 'Mostra Codice', value: 'getProgramCode' },
			],
			value: 0,
			fontSizeLabels: [
				'Piccolo',
				'Medio',
				'Grande',
				'Molto grande'
			],

			daltonicSwitch: 0,
			daltonicType: 1,
			daltonicModes: [
				'Deuteranomaly',
				'Protanomaly',
				'Protanopia'
			],
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
			defaultView: null,
			tab: null,
			tabs: ['Generali', 'Barra degli Strumenti', 'Vista Esecuzione'],
			//tabs: ['Generali', 'Barra degli Strumenti', 'Palette Comandi', 'Vista Esecuzione'],
			ar: false,
			//drawer: null,
			source: null,
			msg: 'Welcome to Your Vue.js App',
			defaultView: 'blocks',
			viste: [
				{ text: 'Blocchi', value: 'blocks' },
				{ text: 'Esecuzione', value: 'exec', disabled: true },
				{ text: 'Python', value: 'python', disabled: true }
			],
		};
	},
	mounted() {

		if (this.$route.params.name) {
			let axios = this.$axios
			let CB = this.CB
			console.log("Loading activity", this.$route.params.name)
			this.saved = true;
			axios.get(CB + '/loadActivity', {
					params: {
						name: this.$route.params.name
					}
				})
				.then(function(response) {
					console.log(response)
					this.activity = response.data
				}.bind(this))
		} else {
			this.restoreDefaults();
		}

	},
	methods: {
		save: function() {
			console.log(JSON.stringify(this.activity))
			if (this.activity.name) {
				let axios = this.$axios
				let CB = this.CB
				axios.post(CB + '/saveActivity', {
						activity: this.activity
					})
					.then(function(data) {
						this.snackbarText = "Attività salvata";
						this.snackbar = true;
						this.saved = true;
					}.bind(this))
			} else {
				this.snackbarText = "Salvataggio non riuscito: inserisci un nome all'attività!";
				this.snackbar = true;
			}
		},
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		},
		addButton: function() {
			this.activity.buttons.push({
				label: '',
			})
		},
		removeButton: function(index) {
			this.activity.buttons.splice(index, 1)
		},
		removeAll: function() {
			this.activity.buttons = []
		},
		restoreDefaults: function() {
			this.activity.buttons = [{
					label: 'Esegui',
					icon: 'play_arrow',
					colorBtn: 'green',
					colorText: 'white--text',
					action: 'runProgramLegacy',
					notErasable: true
				},
				{
					label: 'Salva',
					icon: 'save',
					colorBtn: 'blue',
					colorText: 'white--text',
					action: 'saveProgram'
				}
			]
		}
	}
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rounded1 {
	border-radius: 25px;
	border: 2px solid #73AD21;
	padding: 20px;
	width: 100px;
}

.cardContent {
	padding: 16px;
}

</style>
