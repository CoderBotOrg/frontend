<template>
	<div>
		<v-app id="inspire">
			<sidebar></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()"></v-toolbar-side-icon>
				<v-toolbar-title>Galleria</v-toolbar-title>
			</v-toolbar>
			<v-content>
				Placeholder content {{ photos.length }}
				<v-layout>
					<v-flex xs12 sm8 offset-sm2>
						<v-card>
							<v-container grid-list-sm fluid>
								<v-layout row wrap>
									<v-flex v-for="n in photos.length - 1" :key="n" xs3 d-flex>
										<v-card flat tile class="d-flex">
											
											<v-img :src="CBv1+'/photos/'+photos[n].name" aspect-ratio="1" class="grey lighten-2">
												<span> {{ photos[n].name }} </span>
												<span v-on:click="deletePhoto(photos[n].name)"> Elimina </span>
												<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
													<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
												</v-layout>
											</v-img>
										</a>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card>
					</v-flex>
				</v-layout>
			</v-content>
		</v-app>
	</div>
</template>
<script>
import sidebar from "../components/Sidebar"

export default {
	components: { sidebar },
	name: 'HelloWorld',
	watch: {
		photosN: function() {
			this.l = this.photos.length
		}
	},
	mounted() {
		this.getPhotos()
	},
	methods: {
		getPhotos: function() {
			let axios = this.$axios
			let CBv1 = this.$data.CBv1
			axios.get(CBv1 + '/photos')
				.then(function(response) {
					this.$data.photos = response.data
				}.bind(this))
		},
		deletePhoto: function(name) {
			let axios = this.$axios
			let CBv1 = this.$data.CBv1
			axios.delete(CBv1 + '/photos/'+name)
				.then(function(response) {
					this.getPhotos()
				}.bind(this))
		},
		toggleSidebar: function() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		}
	},
	data() {
		return {
			CB: process.env.CB_ENDPOINT + process.env.APIv2,
			CBv1: process.env.CB_ENDPOINT + process.env.APIv1,
			photos: [],
			drawer: null,
			l: null,
		};
	},
};

</script>
