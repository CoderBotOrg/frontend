<template>
  <v-app id="inspire">
    <sidebar></sidebar>
    <v-app-bar color="indigo" dark fixed app>
      <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
      <v-app-bar-title class="title"><div>CoderBot</div></v-app-bar-title>
      <template v-if="status != 200">
        <v-btn text>
          <v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
        </v-btn>
        <v-btn @click="dialog = true" icon>
          <v-icon>error</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <template v-if="status == 200">
        <v-container>
          <v-row no-gutters>
            <v-col cols="8">
              <v-img :src="webcamStream" style="width: 640px;"/>
            </v-col>
            <v-col cols="4">
              <v-container class="d-flex align-center flex-column">
                <v-row>
                  <v-col class="d-flex align-center flex-column">
                    <v-btn color="indigo" class="white--text jp-btn" v-on:mousedown="move(0)"
                      v-on:mouseup="stop()">
                      <v-icon icon="mdi-arrow-up"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn color="indigo" class="white--text jp-btn" v-on:mousedown="move(1)"
                      v-on:mouseup="stop()">
                      <v-icon icon="mdi-arrow-left"></v-icon>
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn large color="indigo" class="white--text jp-btn" v-on:mousedown="move(2)"
                      v-on:mouseup="stop()">
                      <v-icon icon="mdi-arrow-right"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn color="indigo" class="white--text jp-btn" v-on:mousedown="move(3)"
                      v-on:mouseup="stop()">
                      <v-icon icon="mdi-arrow-down"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <br/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn color="indigo" v-on:click="ttsdialog = true" class="controlBtn"
                      :disabled="!ttsBtnEnabled">
                      {{ $t("message.control_speak") }}
                      <v-icon icon="mdi-bullhorn-variant"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex align-center flex-column">
                    <v-btn color="indigo" class="controlBtn" v-on:click="takePhoto()"
                      :disabled="!photoBtnEnabled">
                      {{ $t("message.control_photo_take") }}
                      <v-icon icon="mdi-camera"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex align-center flex-column">
                    <v-btn color="indigo" class="controlBtn" v-on:click="videoHandler()"
                      :disabled="!videoBtn.enabled">
                      {{ videoBtn.text }}
                      <v-icon dark>mdi-{{ videoBtn.icon }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex align-center flex-column">
                    <v-btn color="indigo" class="controlBtn" to="/gallery">
                      {{ $t("message.control_photo_gallery") }}
                      <v-icon icon="mdi-image-multiple"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-else>
        <br>
        {{ $t("message.coderbot_status_offline_1") }}<br>
        <v-icon large icon="mdi-signal_wifi_off"></v-icon>
      </template>
    </v-main>
    <v-snackbar v-model="snackbar">
      {{ snackText }}
      <v-btn color="pink" text @click="snackbar = false">
        {{ $t("message.close") }}
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="ttsdialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("message.gallery_empty") }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="ttstext" v-bind:label="$t('message.control_text_to_speech')" solo></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray darken-1" text="text" @click="ttsdialog=false">{{ $t("message.cancel") }}</v-btn>
          <v-btn color="green darken-1" text="text" @click="say()">{{ $t("message.control_speak") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import sidebar from '../components/Sidebar';

console.log(process.env.CB_ENDPOINT + process.env.APIv1);

export default {
  components: {
    sidebar
  },
  name: 'Control',
  methods: {
    say() {
      const {
        CBv1
      } = this;
      const axios = this.$axios;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'say',
          param1: this.ttstext
        }
      }).then(() => {
        this.ttsBtnEnabled = false;
        this.ttsdialog = false;
        this.snackText = this.$i18n.t('message.control_speaking');
        this.snackbar = true;
        setTimeout(() => {
          this.ttsBtnEnabled = true;
        }, this.ttstext.length * 200);
      });
    },
    takePhoto() {
      const {
        CBv1
      } = this;
      const axios = this.$axios;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'take_photo'
        }
      }).then(() => {
        this.snackText = this.$i18n.t('message.control_photo_taken');
        this.snackbar = true;
        this.photoBtnEnabled = false;
        setTimeout(() => {
          this.photoBtnEnabled = true;
        }, 1000);
      });
    },
    play_note() {
      const {
        CBv1
      } = this;
      const axios = this.$axios;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'play_note'
        }
      }).then(() => {
        this.ttsBtnEnabled = false;
        this.ttsdialog = false;
        this.snackText = this.$i18n.t('message.control_sount_playing');
        this.snackbar = true;
        setTimeout(() => {
          this.ttsBtnEnabled = true;
        }, 800);
      });
    },

    videoHandler() {
      if (this.videoBtn.action == 'record') this.recordVideo();
      else this.stopVideoRecording();
    },
    recordVideo() {
      const {
        CBv1
      } = this;
      const axios = this.$axios;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'video_rec'
        }
      }).then(() => {
        this.snackText = this.$i18n.t('message.control_video_rec_started');
        this.snackbar = true;
        this.photoBtnEnabled = false;
        this.videoBtn.text = this.$i18n.t('message.control_video_rec_started');
        this.videoBtn.icon = 'stop';
        this.videoBtn.action = 'stop';
      });
    },
    stopVideoRecording() {
      const {
        CBv1
      } = this;
      const axios = this.$axios;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'video_stop'
        }
      }).then(() => {
        this.snackText = this.$i18n.t('message.control_video_rec_stopped');
        this.snackbar = true;
        this.videoBtn.enabled = false;
        this.videoBtn.action = 'record';
        setTimeout(() => {
          this.videoBtn.enabled = true;
          this.videoBtn.text = this.$i18n.t('message.control_video_rec');
          this.videoBtn.icon = 'video-box';
          this.photoBtnEnabled = true;
        }, 1000);
      });
    },
    pollStatus() {
      const axios = this.$axios;
      const {
        CB
      } = this;
      axios.get(`${CB}/status`)
        .then((response) => {
          if (this.status == 0 && response.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_online');
            this.snackbar = true;
          }

          this.statusData = response.data;
          this.status = response.status;
        })
        .catch((error) => {
          // handle error
          console.log(`pollStatus error: ${error}`);

          if (this.status) {
            this.snackText = this.$i18n.t('message.coderbot_offline_2');
            this.snackbar = true;
          }
          this.status = 0;
        });
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
    move(direction) {
      this.pressDuration = performance.now();
      const axios = this.$axios;
      const {
        CB
      } = this;
      if (direction == 0) {
        // UP, move forward
        axios.post(`${CB}/move`, {
          speed: 100,
          elapse: -1,
          distance: 0,
        }).catch((error) => {
          console.log(`move error: ${error}`);
        });
      } else if (direction == 1) {
        // RIGHT, turn right
        axios.post(`${CB}/turn`, {
          speed: -80,
          elapse: -1,
        }).catch((error) => {
          console.log(`turn error: ${error}`);
        });
      } else if (direction == 2) {
        // LEFT, turn left
        axios.post(`${CB}/turn`, {
          speed: 80,
          elapse: -1,
        }).catch((error) => {
          console.log(`turn error: ${error}`);
        });
      } else if (direction == 3) {
        // DOWN, move backwards
        axios.post(`${CB}/move`, {
          speed: -100,
          elapse: -1,
          distance: 0,
        }).catch((error) => {
          console.log(`move error: ${error}`);
        });
      }
    },
    stop() {
      console.log('stopping');
      const axios = this.$axios;
      const {
        CB
      } = this;
      let {
        pressDuration
      } = this;
      pressDuration = performance.now() - this.pressDuration;
      const minTreshold = 250;
      const delay = minTreshold - pressDuration;
      console.log('Pressed for', pressDuration, 'ms');
      if (pressDuration < 500) {
        console.log('Too fast, postponing it by', delay, 'ms..');
        setTimeout(() => {
          axios.post(`${CB}/stop`).catch((error) => {
            console.log(`stopping error: ${error}`);
          });
        }, delay);
      } else {
        axios.post(`${CB}/stop`).catch((error) => {
          console.log(`stop error: ${error}`);
        });
      }
    },
  },
  data() {
    return {
      ttstext: null,
      ttsdialog: false,
      snackText: null,
      snackbar: false,
      webcamStream: `${process.env.CB_ENDPOINT + process.env.APIv1}/video/stream`,
      CB: process.env.CB_ENDPOINT + process.env.APIv2,
      CBv1: process.env.CB_ENDPOINT + process.env.APIv1,
      status: null,
      pressDuration: null,
      ttsBtnEnabled: true,
      photoBtnEnabled: true,
      videoBtn: {
        text: this.$i18n.t('message.control_video_rec'),
        icon: 'video-box',
        enabled: 'true',
        action: 'record',

      },
    };
  },
  mounted() {
    this.pollStatus();
    setInterval(() => {
      this.pollStatus();
    }, 1000);
  },
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

.jp-btn {
  margin: 0px;
  margin-left: 28px;
  margin-right: 28px;
  height: 48px;
  min-width: 0px;
  width: 48px;
  padding: 0 0;
}
</style>
