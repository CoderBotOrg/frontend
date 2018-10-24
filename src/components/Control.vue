<template>
	<v-app id="inspire">
		<sidebar></sidebar>
		<v-toolbar color="indigo" dark fixed app>
			<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
			<v-toolbar-title>CoderBot</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<template v-if="status == 200">
					<v-btn @click="dialog = true" icon>
						<v-icon>check_circle</v-icon>
					</v-btn>
				</template>
				<template v-else>
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
							<v-flex xs12 lg6>
								<img :src="webcamStream"/>

				</v-flex>
								<v-flex xs12 lg6>
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
											<v-btn-toggle>

												<v-btn large color="blue-grey darken-4" class="white--text" v-on:click="say()">
													Pronuncia
													<v-icon dark>chat_bubble_outline</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										<v-flex xs12 sm12>

											<v-btn-toggle>

												<v-btn large color="blue-grey darken-4" class="white--text" v-on:click="takePhoto()">
													Scatta foto
													<v-icon dark>camera_alt</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										
										<v-flex xs12 sm12>
											<v-btn-toggle>

												<v-btn large color="blue-grey darken-4" class="white--text" v-on:click="recordVideo()">
													Registra video
													<v-icon dark>videocam</v-icon>
												</v-btn>
											</v-btn-toggle>
										</v-flex>
										<v-flex xs12 sm12>
											<v-btn-toggle>

												<v-btn large color="blue-grey darken-4" class="white--text" v-on:click="showGallery()">
													Galleria
													<v-icon dark>photo_library</v-icon>
												</v-btn>
											</v-btn-toggle>
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
	</v-app>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	methods: {
		say(){},
		takePhoto(){},
		recordVideo(){},
		showGallery(){},
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
			console.log("move")
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
			snackText: null,
			snackbar: false,
			webcamStream: process.env.CB_ENDPOINT + process.env.APIv1 + '/video/stream',
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			status: null,
			pressDuration: null,
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
</style>
