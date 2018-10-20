<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>Impostazioni</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat @click="save">
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
									<h3 class="text-xs-left">Sistema </h3>
									<v-card>
										<div class="cardContent">
											<v-text-field v-model="settings.cbName" label="Nome CoderBot"></v-text-field>
											<br>
											<div v-for="(value, key, index) in cbInfo">
												{{ key }}: <code>{{ value }}</code>
											</div>
										</div>
									</v-card>
									<br>
									<h3 class="text-xs-left">Stato </h3>
									<v-card>
										<br>
										Robe
										<br>
										<br>
									</v-card>
									<br>
									<h3 class="text-xs-left"> Azioni </h3>
									<v-card>
										<div class="cardContent">
											<v-btn color="info">Spegni</v-btn>
											<v-btn color="info">Riavvia</v-btn>
											<v-btn color="warning">Aggiorna</v-btn>
											<v-btn color="error">Ripristina ad Impostazioni di fabbrica</v-btn>
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
				
				data.power= [remoteConfig.move_power_angle_1,remoteConfig.move_power_angle_2 ,remoteConfig.move_power_angle_3],
				data.btnFun=remoteConfig.button_func,
				// ?
				data.wifiMode= remoteConfig.wifi_mode

				data.wifiSSID= remoteConfig.wifi_ssid
				data.wifiPsw= remoteConfig.wifi_psk
				data.fwdElapse = remoteConfig.move_fw_elapse
				data.fwdSpeed = remoteConfig.move_fw_speed
				data.turnSpeed= remoteConfig.ctrl_tr_speed
				data.turnElapse= remoteConfig.ctrl_tr_elapse
				data.motorMode= remoteConfig.move_motor_mode
				data.trimFactor= remoteConfig.move_motor_trim
				data.startSound= remoteConfig.sound_start
				data.stopSound= remoteConfig.sound_stop
				data.shutterSound= remoteConfig.sound_shutter
				data.startupProgram= remoteConfig.load_at_start
			}.bind(this))
	},
	methods: {
		save: function() {
			let qs = this.$qs
			let selectedTab = this.$data.tab
			let axios = this.$axios
			let CBv1 = this.$data.CBv1

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

			}
		},
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
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
			},




			cbInfo: {
				'Modello': 'CDRBT-01-2017-1',
				'Seriale': '740129387591e',
				'Versione Software Base': '0.1',
				'Versione Backend': '0.3.1a',
				'Versione Web App': '0.1-prelease'
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
	padding: 16px;
}

</style>
