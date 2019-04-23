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
				<!--<template v-if="status == 200">-->
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
												Vue app commit build: <code> {{ lastCommit }} </code>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left">Stato </h3>
										<v-card>
											<div class="cardContent">
												<div v-for="(value, key, index) in cb.status">
													<div v-if="key != 'log'">
														{{ key }}: <code>{{ value }}</code>
													</div>
												</div>
												<br>
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left"> Azioni </h3>
										<v-card>
											<div class="cardContent text-xs-center">
												<v-btn @click="shutdown" color="info">
													<v-icon>fas fa-power-off</v-icon> Spegni
												</v-btn>
												<v-btn @click="reboot" color="info">
													<v-icon>fas fa-redo</v-icon> Riavvia
												</v-btn>
												<v-btn @click="restoreConfig" color="warning">
													<v-icon>fas fa-redo</v-icon> Ripristina Impostazioni
												</v-btn>
												<!-- ** Restore button + dialog box** -->
												<v-dialog v-model="dialog" width="500">
													<v-btn slot="activator" color="error" dark>
														<v-icon>fas fa-wrench</v-icon> Ripristina ad impostazioni di fabbrica
													</v-btn>
													<v-card>
														<v-card-title class="headline grey lighten-2" primary-title>
															<h3>CoderBot - Restore</h3>
														</v-card-title>
														<v-card-text>
															Sei sicuro di voler ripristinare il CoderBot?
															<br>
															<h3><b>Tutti i file salvati verranno cancellati</b></h3>
														</v-card-text>
														<v-divider></v-divider>
														<v-card-actions>
															<v-spacer></v-spacer>
															<v-btn color="primary" @click="dialog = false">
																Esci
															</v-btn>
															<v-btn color="error" @click="restore">
																<b>Ripristina</b>
															</v-btn>
														</v-card-actions>
													</v-card>
												</v-dialog>
												<!-- Logs -->
												<v-dialog v-model="dialog_logs" width="700">
													<v-btn slot="activator" color="warning" dark>
														<v-icon>fas fa-file-signature</v-icon> Show logs
													</v-btn>
													<v-card>
														<v-card-title class="headline grey lighten-2" primary-title>
															<h3>CoderBot - Logs</h3>
														</v-card-title>
														<div class="cardContent">
															<div v-for="value in cb.logs.log">
																{{ value }}
															</div>
														</div>
														<v-divider></v-divider>
														<v-card-actions>
															<v-spacer></v-spacer>
															<v-btn color="primary" @click="dialog_logs = false">
																Esci
															</v-btn>
														</v-card-actions>
													</v-card>
												</v-dialog>
												<!--
												<v-btn color="warning">Aggiorna</v-btn>
												<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn> -->
											</div>
										</v-card>
										<br>
										<h3 class="text-xs-left"> Aggiornamento </h3>
										<v-card>
											<div class="cardContent">
												<template v-if="updateStatus==1">
													Caricamento del file:
													<h3>{{ counter }} %</h3>
													<br>
													{{ updateStatusText }}
												</template>
												<template v-if="updateStatus==2">
												</template>
												<template v-if="updateStatus==0">
													<v-text-field label="Seleziona il pacchetto di aggiornamento" @click='pickFile' v-model='fileName' prepend-icon='attach_file'></v-text-field>
													<input type="file" style="display: none" ref="file" @change="onFilePicked">
													<template v-if="this.fileObj">CoderBot verrà riavviato per applicare l'aggiornamento.<br></template>
													<v-btn v-if="this.fileObj" @click="upload" color="error">Conferma</v-btn>
												</template>
											</div>
										</v-card>
										<br><br>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
						<!--
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

						-->
						<v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap>
									<!-- Column A -->
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">In modalità controllo</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.ctrlFwdSpeed" label="Forward speed" />
												<v-text-field v-model="settings.ctrlFwdElapse" label="Forward elapse / distance" />
												<v-text-field v-model="settings.ctrlTurnSpeed" label="Turn speed" />
												<v-text-field v-model="settings.ctrlTurnElapse" label="Turn elapse / angle" />
											</div>
										</v-card>
										<br><br>
										<h3 class="text-xs-left">In modalità programmazione</h3>
										<v-card>
											<div class="cardContent">
												<v-text-field v-model="settings.moveFwdSpeed" label="Forward speed" />
												<v-text-field v-model="settings.moveFwdElapse" label="Forward elapse / distance" />
												<v-text-field v-model="settings.moveTurnSpeed" label="Turn speed" />
												<v-text-field v-model="settings.moveTurnElapse" label="Turn elapse / angle" />
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
                        <!-- TEST TAB -->
                        <v-tab-item>
							<v-container grid-list-md text-xs-center>
								<v-layout row wrap align-center>
									<v-flex xs12 md6 offset-md3>
										<h3 class="text-xs-left">COMPONENTS TESTS</h3>
										<v-card>
                                            
											<div class="cardContent">
												<div id='test_array'>
                                                        <v-switch label="Motors" value="motors" v-model="checkedTests" color="#f45525"></v-switch>
                                                        <v-switch label="Sonar" value="sonar" v-model="checkedTests" color="#f45525"></v-switch>
                                                        <v-switch label="Speaker" value="speaker" v-model="checkedTests" color="#f45525"></v-switch>
                                                        <v-switch label="OCR" value="ocr" v-model="checkedTests" color="#f45525"></v-switch>
                                                    <span>Checked names: {{ checkedTests }}</span>
                                                </div>
                                                <br>
                                                <div class="text-xs-center">
                                                    <v-btn @click="runTests" slot="activator" color="error" dark>
                                                        <v-icon>fas fa-share-square</v-icon> Run tests
                                                    </v-btn>
                                                </div>
                                            </div>
                                            
                                        </v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-tab-item>
					</v-tabs-items>
				<!--</template>
				<template v-else>
					<br>
					In attesa che CoderBot torni online...<br>
					<v-icon large>signal_wifi_off</v-icon>
				</template>-->
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
	name: 'Settings',
	mounted() {
		this.pollStatus();
		setInterval(function() {
			this.pollStatus();
		}.bind(this), 1000)
		let axios = this.$axios
		let settings = this.settings

		this.getInfoAndStatus();
		this.prepopulate();
	},
	methods: {
		pickFile() {
			this.$refs.file.click()
		},
		onFilePicked(e) {
			const files = e.target.files
			this.fileName = files[0].name
			this.fileObj = files[0]
			this.formdata = new FormData();
			this.formdata.append('file_to_upload', files[0], files[0].name);
		},
		upload() {
			const config = {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: progressEvent => {
					this.counter = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
				}
			}
			this.updateStatus = 1

			this.$axios.post(this.CB + '/updateFromPackage', this.formdata, config).then(function(result) {
				this.uploadCompleted = true;
				this.uploadInProgress = false;
				console.dir(result.data);

				this.updateStatusText = 'Upload completato. Riavvio in corso.'

			}.bind(this))

		},
		restoreConfig() {
			let axios = this.$axios
			let CB = this.CB
			axios.post(CB + '/restoreSettings')
				.then(function(response) {
					this.snackText = 'Impostazioni ripristinate'
					this.snackbar = true
					this.prepopulate()
				}.bind(this))
		},
        runTests() {
			let axios = this.$axios
			let CB = this.CB
			axios.post(CB + '/testCoderbot', { params: { varargin: this.checkedTests } })
				.then(function(response) {
					this.snackText = 'Running tests'
					this.snackbar = true
					this.prepopulate()
				}.bind(this))
		},
		restore() {
			let axios = this.$axios
			let CB = this.CB
			axios.post(CB + '/reset')
				.then(function(response) {
					this.snackText = 'Ripristino ad impostazioni di fabbrica \
                                        Reboot in corso...'
					this.snackbar = true
					this.prepopulate()
					setTimeout(() => $(dialog).close(), 5000)
					this.dialog = false
				}.bind(this))
		},

		shutdown() {
			let axios = this.$axios
			let CBv1 = this.CBv1
			axios.get(CBv1 + '/bot', { params: { cmd: 'halt' } })
				.then(function(response) {

					this.snackText = 'Coderbot in spegnimento..'
					this.snackbar = true
				})
		},
		reboot() {
			let axios = this.$axios
			let CBv1 = this.CBv1
			axios.get(CBv1 + '/bot', { params: { cmd: 'reboot' } })
				.then(function(response) {
					this.snackText = 'Riavvio iniziato...'
					this.snackbar = true
				})
		},
		getInfoAndStatus() {
			// Get bot info and status
			let axios = this.$axios

			axios.get(this.CB + '/status')
				.then(function(response) {
					this.cb.status = response.data
					this.cb.logs.log = response.data.log
				}.bind(this))
			axios.get(this.CB + '/info')
				.then(function(response) {
					this.cb.info = response.data
				}.bind(this))
		},
		pollStatus() {
			let axios = this.$axios
			let CB = this.CB
			let status = this.status
			axios.get(CB + '/status')
				.then(function(response) {
					if (this.status == 0 && response.status) {
						this.snackText = 'CoderBot è tornato online'
						this.snackbar = true
						this.getInfoAndStatus();
						this.prepopulate();
					}

					this.statusData = response.data
					this.status = response.status
					this.cb.logs.log = response.data.log
				}.bind(this))
				.catch(function(error) {
					// handle error
					console.log(error);

					if (this.status) {
						this.snackText = 'CoderBot irrangiungibile'
						this.snackbar = true
					}
					this.status = 0
				}.bind(this))
		},
		prepopulate: function() {
			let axios = this.$axios
			let settings = this.settings
			// Prepopulate settings
			axios.get(this.CBv1 + '/config')
				.then(function(response) {
					// handle success
					let data = this.settings
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
					/*
					data.wifiMode = remoteConfig.wifi_mode

					data.wifiSSID = remoteConfig.wifi_ssid
					data.wifiPsw = remoteConfig.wifi_psk
					*/
					data.motorMode = remoteConfig.move_motor_mode
					data.trimFactor = remoteConfig.move_motor_trim
					data.startSound = remoteConfig.sound_start
					data.stopSound = remoteConfig.sound_stop
					data.shutterSound = remoteConfig.sound_shutter
					data.startupProgram = remoteConfig.load_at_start
					data.progLevel = remoteConfig.prog_level

					data.moveFwdElapse = remoteConfig.move_fw_elapse
					data.moveFwdSpeed = remoteConfig.move_fw_speed
					data.moveTurnElapse = remoteConfig.move_tr_elapse
					data.moveTurnSpeed = remoteConfig.move_tr_speed

					data.ctrlFwdElapse = remoteConfig.ctrl_fw_elapse
					data.ctrlFwdSpeed = remoteConfig.ctrl_fw_speed
					data.ctrlTurnElapse = remoteConfig.ctrl_tr_elapse
					data.ctrlTurnSpeed = remoteConfig.ctrl_tr_speed

				}.bind(this))
		},
		save: function() {
			let qs = this.$qs
			let selectedTab = this.tab
			let axios = this.$axios
			let CBv1 = this.CBv1
			let data = this.settings

			if (selectedTab == 10) {
				var valuesAsString = qs.stringify({
					'wifi_mode': this.settings.wifiMode,
					'wifi_ssid': this.settings.wifiSSID,
					'wifi_psk': this.settings.wifiPsw,
				})
				// Send post with URL encoded parameters
				axios.post(CBv1 + '/wifi', valuesAsString)
					.then(function() {
						console.log("Sent")
						this.snackText = "Impostazioni di rete aggiornate"
						this.snackbar = true
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
					'move_motor_mode': data.motorMode,
					'move_motor_trim': data.trimFactor,
					'sound_start': data.startSound,
					'sound_stop': data.stopSound,
					'sound_shutter': data.shutterSound,
					'load_at_start': data.startupProgram,
					'prog_level': data.progLevel,

					'move_fw_elapse': data.moveFwdElapse,
					'move_fw_speed': data.moveFwdSpeed,
					'move_tr_elapse': data.moveTurnElapse,
					'move_tr_speed': data.moveTurnSpeed,

					'ctrl_fw_elapse': data.ctrlFwdElapse,
					'ctrl_fw_speed': data.ctrlFwdSpeed,
					'ctrl_tr_elapse': data.ctrlTurnElapse,
					'ctrl_tr_speed': data.ctrlTurnSpeed,
				})
				axios.post(CBv1 + '/config', legacySettings)
					.then(function() {
						console.log('Updated settings')
						this.prepopulate();
						this.snackText = "Impostazioni aggiornate"
						this.snackbar = true
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
			formdata: null,
			files: null,
			status: null,
			dialog: false,
			dialog_logs:false,
			lastCommit: process.env.lastCommit,
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			CBv1: process.env.CB_ENDPOINT,
			snackbar: null,
			snackText: null,
			fileName: '',
			fileObj: '',
			fileUrl: '',
			counter: 0,
			updateStatusText: '',
            checkedTests: [], // checked test array
			updateStatus: 0,
			// TODO: Prepopulate this
			settings: {
				cbName: 'CoderBot di Antonio',
				power: [null, null, null],
				startupProgram: null,
				btnFun: null,
				wifiMode: 'ap',
				wifiSSID: null,
				wifiPsw: null,

				moveFwdElapse: null,
				moveFwdSpeed: null,
				moveTurnElapse: null,
				moveTurnSpeed: null,
				ctrlFwdElapse: null,
				ctrlFwdSpeed: null,
				ctrlTurnElapse: null,
				ctrlTurnSpeed: null,

				motorMode: null,
				trimFactor: null,
				startSound: null,
				stopSound: null,
				shutterSound: null,
				startupProgram: null,
				progLevel: null,
			},

			blocklyToolboxItems: [
				{ text: 'Movimento', value: 'basic_move' },
				{ text: 'Base', value: 'basic' },
				{ text: 'Standard', value: 'std' },
				{ text: 'Avanzate', value: 'adv' },
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
					kernel: null,
                    motors: null
				},
				logs: {
					log: null
				}
			},
			drawer: null,
			tab: null,
			//tabs: ['Generali', 'Rete', 'Movimento', 'Suoni', 'Avanzate'],
			tabs: ['Generali', 'Movimento', 'Suoni', 'Avanzate', 'Test'],
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

.fa,
.fas,
.fab {
	font-weight: 600;
	margin-right: 7px;
	text-size: 10px;
}

</style>
