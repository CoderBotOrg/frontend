<template>
	<v-app id="inspire">
		<sidebar></sidebar>
		<v-toolbar color="indigo" dark fixed app>
			<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
			<v-toolbar-title>CoderBot</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<!--
				<template v-if="status == 200">
					<v-btn @click="dialog = true" icon>
						<v-icon>check_circle</v-icon>
					</v-btn>
				</template>
			-->
				<template v-if="status != 200">
					<v-btn flat>
						<v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
					</v-btn>
					<v-btn @click="dialog = true" icon>
						<v-icon>error</v-icon>
					</v-btn>
				</template>
			</v-toolbar-items>
		</v-toolbar>
		<v-content>
			<template v-if="status == 200">
				<div>
					<v-container grid-list-md text-xs-center>
						<v-layout row wrap>
							<v-flex xs12 lg8>
								<v-img :src="webcamStream"/>
								</v-flex>
								<v-flex xs12 lg4>
									<br>
									<v-layout row wrap>
										<v-flex xs12 sm12>
											<v-btn-toggle>
												<v-btn large color="blue-grey darken-4" class="white--text" v-on:mousedown="move(0)" v-on:mouseup="stop()">
													<v-icon dark>keyboard_arrow_up</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn-toggle>
												<v-btn large color="blue-grey darken-4" class="white--text" v-on:mousedown="move(1)" v-on:mouseup="stop()">
													<v-icon dark>keyboard_arrow_left</v-icon>
												</v-btn>
												<span style="background-color: #fafafa;width: 64px" > </span>
												<v-btn large color="blue-grey darken-4" class="white--text" v-on:mousedown="move(2)" v-on:mouseup="stop()">
													<v-icon dark>keyboard_arrow_right</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn-toggle>
												<v-btn large color="blue-grey darken-4" class="white--text" v-on:mousedown="move(3)" v-on:mouseup="stop()">
													<v-icon dark>keyboard_arrow_down</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										<v-flex xs12 sm12>
											<br><br><br>
											<v-btn large color="blue-grey darken-1" v-on:click="ttsdialog = true" class="controlBtn" :disabled="!ttsBtnEnabled">
												Pronuncia
												<v-icon>chat_bubble_outline</v-icon>
											</v-btn>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn large color="blue-grey darken-1" class="controlBtn" v-on:click="takePhoto()" :disabled="!photoBtnEnabled">
												Scatta foto
												<v-icon dark>camera_alt</v-icon>
											</v-btn>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn large color="blue-grey darken-1" class="controlBtn" v-on:click="videoHandler()" :disabled="!videoBtn.enabled">
												{{ videoBtn.text }}
												<v-icon dark>{{ videoBtn.icon }} </v-icon>
											</v-btn>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn large color="blue-grey darken-1" class="controlBtn" to="/gallery">
												Galleria
												<v-icon dark>photo_library</v-icon>
											</v-btn>
										</v-flex>
									</v-layout>
								</v-flex>
						</v-layout>
					</v-container>
				</div>
			</template>
			<template v-else>
				<br>
				In attesa che CoderBot torni online...<br>
				<v-icon large>signal_wifi_off</v-icon>
			</template>
		</v-content>
		<v-snackbar v-model="snackbar">
			{{ snackText }}
			<v-btn color="pink" flat @click="snackbar = false">
				Chiudi
			</v-btn>
		</v-snackbar>
		<v-dialog v-model="ttsdialog" width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Text to Speech</span>
				</v-card-title>
				<v-card-text>
					<v-text-field v-model="ttstext" label="Frase da pronunciare" solo></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="gray darken-1" flat="flat" @click="ttsdialog=false">Annulla</v-btn>
					<v-btn color="green darken-1" flat="flat" @click="say()">Pronuncia</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-app>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	methods: {
		say() {
			let CBv1 = this.$data.CBv1
			let axios = this.$axios;
			axios.get(CBv1 + '/bot', { params: { 'cmd': 'say', 'param1': this.$data.ttstext } })
				.then(function(response) {
					this.$data.ttsBtnEnabled = false
					this.$data.ttsdialog = false
					this.$data.snackText = 'Sto pronunciando'
					this.$data.snackbar = true
					setTimeout(function() {
						this.$data.ttsBtnEnabled = true
					}.bind(this), this.$data.ttstext.length * 200)
				}.bind(this))
		},
		takePhoto() {
			let CBv1 = this.$data.CBv1
			let axios = this.$axios;
			axios.get(CBv1 + '/bot', { params: { 'cmd': 'take_photo' } })
				.then(function(response) {
					this.$data.snackText = 'Foto scattata'
					this.$data.snackbar = true
					this.$data.photoBtnEnabled = false
					setTimeout(function() {
						this.$data.photoBtnEnabled = true
					}.bind(this), 1000)

				}.bind(this))
		},
		videoHandler() {
			if (this.$data.videoBtn.action == 'record')
				this.recordVideo()
			else
				this.stopVideoRecording()
		},
		recordVideo() {
			let CBv1 = this.$data.CBv1
			let axios = this.$axios;
			axios.get(CBv1 + '/bot', { params: { 'cmd': 'video_rec' } })
				.then(function(response) {
					this.$data.snackText = 'Registrazione Avviata'
					this.$data.snackbar = true
					this.$data.photoBtnEnabled = false
					this.$data.videoBtn.text = 'Ferma registrazione video'
					this.$data.videoBtn.icon = 'stop'
					this.videoBtn.action = 'stop'

				}.bind(this))
		},
		stopVideoRecording() {
			let CBv1 = this.$data.CBv1
			let axios = this.$axios;
			axios.get(CBv1 + '/bot', { params: { 'cmd': 'video_stop' } })
				.then(function(response) {
					this.$data.snackText = 'Registrazione terminata'
					this.$data.snackbar = true
					this.$data.videoBtn.enabled = false
					this.videoBtn.action = 'record'
					setTimeout(function() {
						this.$data.videoBtn.enabled = true
						this.$data.videoBtn.text = 'Registra Video'
						this.$data.videoBtn.icon = 'videocam'
						this.$data.photoBtnEnabled = true
					}.bind(this), 1000)
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
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		},
		move: function(direction) {
			this.$data.pressDuration = performance.now()
			let axios = this.$axios
			let CB = this.$data.CB
			if (direction == 0) {
				// UP, move forward
				axios.post(CB + '/move', {
					speed: 100,
					elapse: -1
				}).then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			} else if (direction == 1) {
				// RIGHT, turn right
				axios.post(CB + '/turn', {
					speed: -80,
					elapse: -1
				}).then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			} else if (direction == 2) {
				// LEFT, turn left
				axios.post(CB + '/turn', {
					speed: 80,
					elapse: -1
				}).then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			} else if (direction == 3) {
				// DOWN, move backwards
				axios.post(CB + '/move', {
					speed: -100,
					elapse: -1
				}).then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			}
		},
		stop: function() {
			console.log("stopping")
			let axios = this.$axios
			let CB = this.$data.CB
			let pressDuration = this.$data.pressDuration
			pressDuration = performance.now() - this.$data.pressDuration
			let minTreshold = 500
			let delay = minTreshold - pressDuration
			console.log("Pressed for", pressDuration, "ms")
			if (pressDuration < 500) {
				console.log("Too fast, postponing it by", delay, "ms..")
				setTimeout(function() {
					axios.post(CB + '/stop').then(function(response) {
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				}, delay);
			} else {
				axios.post(CB + '/stop').then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			}
		}
	},
	data() {
		return {
			ttstext: null,
			ttsdialog: false,
			snackText: null,
			snackbar: false,
			webcamStream: process.env.CB_ENDPOINT + process.env.APIv1 + '/video/stream',
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			CBv1: process.env.CB_ENDPOINT + process.env.APIv1,
			status: null,
			pressDuration: null,
			ttsBtnEnabled: true,
			photoBtnEnabled: true,
			videoBtn: {
				'text': 'Registra Video',
				'icon': 'videocam',
				'enabled': 'true',
				'action': 'record'

			}
		};
	},
	mounted() {
		this.pollStatus();
		setInterval(function() {
			this.pollStatus();
		}.bind(this), 1000)
	}
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controlBtn {
	color: white;
	margin: 2px 3px;
	padding-right: 25px;
	/* 32 - icon additional margin */
}

.controlBtn .v-icon {
	margin: 7px;
}

</style>
