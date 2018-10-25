<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>Impostazioni</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<template v-if="status == 200">
						<v-btn flat @click="save">
							<v-icon>save</v-icon>
							Salva
						</v-btn>
					</template>
					<template v-else>
						<v-btn flat>
							<v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
						</v-btn>
					</template>
				</v-toolbar-items>
				<v-tabs slot="extension" v-model="tab" centered color="transparent" slider-color="white">
					<v-tab v-for="item in tabs" :key="item">
						{{ item }}
					</v-tab>
				</v-tabs>
			</v-toolbar>
			<v-content>
				<template v-if="status == 200">
					<v-tabs-items v-model="tab">
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Sistema </h3>
										<v-card>
											<div class="cardContent">
												<v-select v-model="settings.progLevel" :items="blocklyToolboxItems" label="Livello Toolbox Blockly"></v-select>
												<!--<v-text-field v-model="settings.cbName" label="Nome CoderBot"></v-text-field>
												<br>-->
												<div v-for="(value, key, index) in cb.info">
													{{ key }}: <code>{{ value }}</code>
												</div>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left">Stato </h3>
										<v-card>
											<div class="cardContent">
												<div v-for="(value, key, index) in cb.status">
													{{ key }}: <code>{{ value }}</code>
												</div>
												<br>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left"> Azioni </h3>
										<v-card>
											<div class="cardContent">
												<v-btn @click="shutdown" color="info"><v-icon>fas fa-power-off</v-icon>  Spegni</v-btn>
												<v-btn @click="reboot" color="info"><v-icon>fas fa-redo</v-icon> Riavvia</v-btn>
												<!--
												<v-btn color="warning">Aggiorna</v-btn>
												<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn>-->
											</div>
										</v-card>
										<br><br>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Configurazione di Rete</h3>
										<v-card>
											<div class="cardContent">
												<v-radio-group v-model="settings.wifiMode" column>
													<v-radio label="Connetti ad una rete WiFi già esistente (client)" value="client"></v-radio>
													<v-radio label="Lascia che CoderBot configuri la propria rete WiFi locale (ad-hoc)" value="ap"></v-radio>
													<div v-if="settings.wifiMode == 'client'">
														<v-text-field v-model="settings.wifiSSID" label="SSID"></v-text-field>
														<v-text-field v-model="settings.wifiPsw" label="Password"></v-text-field>
													</div>
													<div v-if="settings.wifiMode =='ap'"> SSID: <code> coderbot </code> Password: <code>coderb0t01 </code> </div>
												</v-radio-group>
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
							<v-card-text>
							</v-card-text>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Step timing | distance / angle</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.fwdSpeed" label="Forward speed" />
												<v-text-field v-model="settings.fwdElapse" label="Forward elapse / distance" />
												<v-text-field v-model="settings.turnSpeed" label="Turn speed" />
												<v-text-field v-model="settings.turnElapse" label="Turn elapse / angle" />
											</div>
										</v-card>
										<br><br>
										<h3 class="text-xs-left">Parametri Motori</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.motorMode" label="Motor control mode" />
												<v-text-field v-model="settings.trimFactor" label="Trim factor (1.0 = center)" />
												<v-text-field v-model="settings.power[0]" label="Power (target angle -15)" />
												<v-text-field v-model="settings.power[1]" label="Power (target angle -4)" />
												<v-text-field v-model="settings.power[2]" label="Power (target angle -1)" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Suoni personalizzati</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.startSound" label="Avvio" />
												<v-text-field v-model="settings.stopSound" label="Stop" />
												<v-text-field v-model="settings.shutterSound" label="Otturatore" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">Funzione pulsante fisico</h3>
										<v-card>
											<div class="cardContent">
												<v-radio-group v-model="settings.btnFun" column>
													<v-radio label="Nessuno" value="none" />
													<v-radio label="Inizia/Interrompi programma corrente" value="startstop" />
												</v-radio-group>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left">Carica all'avvio</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.startupProgram" label="Nome script" />
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
					</v-tabs-items>
				</template>
				<template v-else>
					<br>
					In attesa che CoderBot torni online...<br>
					<v-icon large>signal_wifi_off</v-icon>
				</template>
			</v-content>
			<!-- Notification Snackbar -->
			<v-snackbar v-model="snackbar">
				{{ snackText }}
				<v-btn color="pink" flat @click="snackbar = false">
					Chiudi
				</v-btn>
			</v-snackbar>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	mounted() {
		this.pollStatus();
		setInterval(function() {
			this.pollStatus();
		}.bind(this), 1000)
		let axios = this.$axios
		let settings = this.$data.settings

		this.getInfoAndStatus();
		this.prepopulate();
	},
	methods: {
		shutdown() {
			let axios = this.$axios
			let CBv1 = this.$data.CBv1
			axios.get(CBv1 + '/bot', { params: { cmd: 'halt' } })
				.then(function(response) {

					this.$data.snackText = 'Coderbot in spegnimento..'
					this.$data.snackbar = true
				})
		},
		reboot() {
			let axios = this.$axios
			let CBv1 = this.$data.CBv1
			axios.get(CBv1 + '/bot', { params: { cmd: 'reboot' } })
				.then(function(response) {
					this.$data.snackText = 'Riavvio iniziato...'
					this.$data.snackbar = true
				})
		},
		getInfoAndStatus() {
			// Get bot info and status
			let axios = this.$axios

			axios.get(this.$data.CB + '/status')
				.then(function(response) {
					this.$data.cb.status = response.data
				}.bind(this))
			axios.get(this.$data.CB + '/info')
				.then(function(response) {
					this.$data.cb.info = response.data
				}.bind(this))
		},
		pollStatus() {
			let axios = this.$axios
			let CB = this.$data.CB
			let status = this.$data.status
			axios.get(CB + '/status')
				.then(function(response) {
					if (this.$data.status == 0 && response.status) {
						this.$data.snackText = 'CoderBot è tornato online'
						this.$data.snackbar = true
						this.getInfoAndStatus();
						this.prepopulate();
					}

					//console.log(response)
					this.$data.statusData = response.data
					this.$data.status = response.status
				}.bind(this))
				.catch(function(error) {
					// handle error
					console.log(error);

					if (this.$data.status) {
						this.$data.snackText = 'CoderBot irrangiungibile'
						this.$data.snackbar = true
					}
					this.$data.status = 0
				}.bind(this))
		},
		prepopulate: function() {
			let axios = this.$axios
			let settings = this.$data.settings
			// Prepopulate settings
			axios.get(this.$data.CBv1 + '/config')
				.then(function(response) {
					// handle success
					let data = this.$data.settings
					console.log(response.data);
					let remoteConfig = response.data
					/*
					button_func: "none"
					camera_color_object_size_max: "160000"
					camera_color_object_size_min: "4000"
					camera_exposure_mode: "auto"
					camera_framerate: "30"
					camera_jpeg_bitrate: "1000000"
					camera_jpeg_quality: "5"
					camera_path_object_size_max: "160000"
					camera_path_object_size_min: "4000"
					cnn_default_model: ""
					ctrl_fw_elapse: "-1"
					ctrl_fw_speed: "99"
					ctrl_hud_image: ""
					ctrl_tr_elapse: "-1"
					ctrl_tr_speed: "80"
					cv_image_factor: "2"
					load_at_start: ""
					move_fw_elapse: "1"
					move_fw_speed: "100"
					move_motor_mode: "dc"
					move_motor_trim: "1"
					move_power_angle_1: "45"
					move_power_angle_2: "60"
					move_power_angle_3: "60"
					move_tr_elapse: "0.5"
					move_tr_speed: "85"
					prog_level: "adv"
					prog_maxblocks: "-1"
					prog_scrollbars: "true"
					show_control_move_commands: "true"
					show_page_control: "true"
					show_page_prefs: "true"
					show_page_program: "true"
					sound_shutter: "$shutter.mp3"
					sound_start: "$startup.mp3"
					sound_stop: "$shutdown.mp3"
					*/

					data.power = [remoteConfig.move_power_angle_1, remoteConfig.move_power_angle_2, remoteConfig.move_power_angle_3]
					data.btnFun = remoteConfig.button_func
					// ?
					data.wifiMode = remoteConfig.wifi_mode

					data.wifiSSID = remoteConfig.wifi_ssid
					data.wifiPsw = remoteConfig.wifi_psk
					data.fwdElapse = remoteConfig.move_fw_elapse
					data.fwdSpeed = remoteConfig.move_fw_speed
					data.turnSpeed = remoteConfig.ctrl_tr_speed
					data.turnElapse = remoteConfig.ctrl_tr_elapse
					data.motorMode = remoteConfig.move_motor_mode
					data.trimFactor = remoteConfig.move_motor_trim
					data.startSound = remoteConfig.sound_start
					data.stopSound = remoteConfig.sound_stop
					data.shutterSound = remoteConfig.sound_shutter
					data.startupProgram = remoteConfig.load_at_start
					data.progLevel = remoteConfig.prog_level
				}.bind(this))
		},
		save: function() {
			let qs = this.$qs
			let selectedTab = this.$data.tab
			let axios = this.$axios
			let CBv1 = this.$data.CBv1
			let data = this.$data.settings

			if (selectedTab == 1) {
				var valuesAsString = qs.stringify({
					'wifi_mode': this.$data.settings.wifiMode,
					'wifi_ssid': this.$data.settings.wifiSSID,
					'wifi_psk': this.$data.settings.wifiPsw,
				})
				// Send post with URL encoded parameters 
				axios.post(CBv1 + '/wifi', valuesAsString)
					.then(function() {
						console.log("Sent")
						this.$data.snackText = "Impostazioni di rete aggiornate"
						this.$data.snackbar = true
					}.bind(this))

			} else {
				let legacySettings = qs.stringify({
					'wifi_mode': data.wifiMode,
					'wifi_ssid': data.wifiSSID,
					'wifi_psk': data.wifiPsw,
					'move_power_angle_1': data.power[0],
					'move_power_angle_2': data.power[1],
					'move_power_angle_3': data.power[2],
					'button_func': data.btnFun,
					'move_fw_elapse': data.fwdElapse,
					'move_fw_speed': data.fwdSpeed,
					'ctrl_tr_speed': data.turnSpeed,
					'ctrl_tr_elapse': data.turnElapse,
					'move_motor_mode': data.motorMode,
					'move_motor_trim': data.trimFactor,
					'sound_start': data.startSound,
					'sound_stop': data.stopSound,
					'sound_shutter': data.shutterSound,
					'load_at_start': data.startupProgram,
					'prog_level': data.progLevel
				})
				axios.post(CBv1 + '/config', legacySettings)
					.then(function() {
						console.log('Updated settings')
						this.prepopulate();
						this.$data.snackText = "Impostazioni aggiornate"
						this.$data.snackbar = true
					}.bind(this))
			}
		},
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
			status: null,
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			CBv1: process.env.CB_ENDPOINT,
			snackbar: null,
			snackText: null,
			// TODO: Prepopulate this
			settings: {
				cbName: 'CoderBot di Antonio',
				power: [null, null, null],
				startupProgram: null,
				btnFun: null,
				wifiMode: 'ap',
				wifiSSID: null,
				wifiPsw: null,
				fwdSpeed: null,
				fwdElapse: null,
				turnSpeed: null,
				turnElapse: null,
				motorMode: null,
				trimFactor: null,
				startSound: null,
				stopSound: null,
				shutterSound: null,
				startupProgram: null,
				progLevel: null
			},

			blocklyToolboxItems: [
				{text:'Movimento', value:'basic_move'},
				{text:'Base', value:'basic'},
				{text:'Standard', value:'std'},
				{text:'Avanzate', value:'adv'},
			],
			cb: {
				info: {
					status: null,
					internetConnectivity: null,
					temp: null,
					uptime: null
				},
				status: {
					model: null,
					serial: null,
					cbVersion: null,
					backendVersion: null,
					vueVersion: null,
					kernel: null
				}
			},
			drawer: null,
			tab: null,
			tabs: ['Generali', 'Rete', 'Movimento', 'Suoni', 'Avanzate'],
		}
	}
}

</script>
<style scoped>
.cardContent {
	text-align: left;
	font-size: 16px;
	padding: 16px;
}

.fa, .fas, .fab {
	font-weight: 600;
	margin-right: 7px;
	text-size:10px;
}
</style>
