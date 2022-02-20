<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ $t("message.gallery_title") }}</v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-layout>
          <v-flex xs12 sm8 offset-sm2>
            <template v-if="photos.length == 0">
              <br>
              <h3>{{ $t("message.gallery_empty") }}</h3>
            </template>
            <template v-else>
              <v-container grid-list-sm fluid>
                <v-layout row wrap>
                  <v-flex v-for="n in photos.length" :key="n" xs3 d-flex>
                    <v-card
                      class="mx-auto my-12"
                      max-width="256"
                      >
                      <a class="text-decoration-none" @click="photo=photos[n-1]; gallery_detail=true">
                      <v-img v-if="photos[n-1].type=='jpg'" :src="CBv1+'/photos/'+photos[n-1].thumbName" class="grey lighten-2">
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-2>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                      <v-img v-else-if="photos[n-1].type=='mp4'" :src="CBv1+'/photos/'+photos[n-1].thumbName" class="grey lighten-2">
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                      <v-card-title class="subheading">
                        {{ photos[n-1].name }}
                      </v-card-title>
                      </a>
                      <v-card-actions>
                        <v-btn
                          v-on:click="photo=photos[n-1]; confirmDeleteDlg=true" text icon color="red lighten-2">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-dialog v-model="gallery_detail">
                <v-card class="mx-auto my-12" max-width="640">
                  <v-card-title class="text-h5 grey lighten-2">
                    {{ photo.name }}
                  </v-card-title>
                  <v-img v-if="photo.type=='jpg'" height="100%" :src="CBv1+'/photos/'+photo.fileName" class="grey lighten-2" ref="photo" @click="getPixelColor">
                    <v-layout slot="placeholder" align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </v-img>
                  <video v-else-if="photo.type=='mp4'" controls autoplay :src="CBv1+'/photos/'+photo.fileName"/>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-text-field v-if="get_pixel_color" v-model="pixel_color" v-bind:label="$t('message.gallery_pixel_color')"
                      readonly
                    >
                    </v-text-field>
                    <v-btn-toggle
                      v-model="get_pixel_color"
                    >
                    <v-btn
                      text
                      value="true"
                    >
                      {{ $t("message.gallery_get_pixel_color") }}
                    </v-btn>
                    </v-btn-toggle>
                    <v-btn
                      color="primary"
                      text
                      @click="gallery_detail = false"
                    >
                      {{ $t("message.close") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="confirmDeleteDlg"
                persistent
                max-width="290"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    {{ $t("message.gallery_photo_confirm_title") }}
                  </v-card-title>
                  <v-card-text>{{ $t("message.gallery_photo_confirm_text") }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="confirmDeleteDlg = false"
                    >
                      {{ $t("message.cancel") }}
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="confirmDeleteDlg = false; deletePhoto(photo.fileName)"
                    >
                      {{ $t("message.ok") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </template>
          </v-flex>
        </v-layout>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import sidebar from '../components/Sidebar';

export default {
  components: {
    sidebar
  },
  name: 'Gallery',
  mounted() {
    this.getPhotos();
  },
  methods: {
    getPhotos() {
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      this.photos = [];
      axios.get(`${CBv1}/photos`)
        .then((response) => {
          response.data.forEach((element) => {
            this.photos.push(
              {
                name: element.name.substring(0, element.name.indexOf('.')),
                type: element.name.substring(element.name.indexOf('.') + 1),
                thumbName: `${element.name.substring(0, element.name.indexOf('.'))}_thumb.jpg`,
                fileName: element.name
              }
            );
          });
          this.photo = {};
        });
    },
    deletePhoto(name) {
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      axios.delete(`${CBv1}/photos/${name}`)
        .then(() => {
          this.getPhotos();
        });
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
    getPixelColor(event) {
      if (this.get_pixel_color) {
        const img = this.$refs.photo.image;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        img.crossOrigin = 'Anonymous';
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        const pixelData = canvas.getContext('2d').getImageData(event.layerX, event.layerY, 1, 1).data;
        /* eslint-disable prefer-template */
        const colorHex = '#' + this.paddedHexString(pixelData[0]) + this.paddedHexString(pixelData[1]) + this.paddedHexString(pixelData[2]);
        /* eslint-enable */
        this.pixel_color = colorHex;
      }
    },
    paddedHexString(n) {
      const ns = n.toString(16);
      /* eslint-disable prefer-template */
    	return ('00' + ns).substring(ns.length);
      /* eslint-enable */
    }
  },
  data() {
    return {
      CB: process.env.CB_ENDPOINT + process.env.APIv2,
      CBv1: process.env.CB_ENDPOINT + process.env.APIv1,
      photos: [],
      drawer: null,
      l: null,
      photo: null,
      gallery_detail: null,
      confirmDeleteDlg: null,
      get_pixel_color: false,
      pixel_color: ''
    };
  },
  computed: {

  }
};
</script>
<style scoped>
.v-card {
  margin: 10px;
}

.container {
  padding-top: 0px;
  margin-top: 0px;
}
</style>
