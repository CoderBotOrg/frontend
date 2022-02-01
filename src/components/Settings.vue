<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ $t("message.settings_title") }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-if="status == 200">
          <v-btn text @click="save">
            <v-icon>save</v-icon>
            Salva
          </v-btn>
        </template>
        <template v-else>
          <v-btn text>
            <v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
          </v-btn>
        </template>
        <v-tabs slot="extension" v-model="tab" centered slider-color="white">
          <v-tab v-for="item in tabs" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <v-main>
        <!--<template v-if="status == 200">-->
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t("message.settings_system") }} </h3>
                  <v-card>
                    <div class="cardContent">
                      <v-select v-model="settings.progLevel" :items="blocklyToolboxItems"
                        v-bind:label="$t('message.settings_toolbox_level')"></v-select>
                      <!--<v-text-field v-model="settings.cbName" v-bind:label="Nome CoderBot"></v-text-field>
												<br>-->
                      <div v-for="(value, key) in cb.info" :key="key">
                        {{ key }}: <code>{{ value }}</code>
                      </div>
                      {{ $t('message.settings_frontend_build') }}: <code> {{ lastCommit }} </code>
                    </div>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left">Stato </h3>
                  <v-card>
                    <div class="cardContent">
                      <div v-for="(value, key) in cb.status" :key="key">
                        <div v-if="key != 'log'">
                          {{ key }}: <code>{{ value }}</code>
                        </div>
                      </div>
                      <br>
                    </div>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left"> {{ $t('message.settings_actions') }} </h3>
                  <v-card>
                    <div class="cardContent text-xs-center">
                      <v-btn @click="shutdown" color="info">
                        <v-icon>fas fa-power-off</v-icon> {{ $t('message.settings_actions_off') }}
                      </v-btn>
                      <v-btn @click="reboot" color="info">
                        <v-icon>fas fa-redo</v-icon> {{ $t('message.settings_actions_restart') }}
                      </v-btn>
                      <v-btn @click="restoreConfig" color="warning">
                        <v-icon>fas fa-redo</v-icon> {{ $t('message.settings_actions_reset') }}
                      </v-btn>
                      <!-- ** Restore button + dialog box** -->
                      <v-dialog v-model="dialog" width="500">
                        <!-- eslint-disable-next-line vue/no-unused-vars -->
                        <template v-slot:activator="data">
                          <v-btn slot="activator" color="error" dark>
                            <v-icon>fas fa-wrench</v-icon> {{ $t('message.settings_action_reset_factory') }}
                          </v-btn>
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              <h3>CoderBot - {{ $t('message.settings_actions_reset_factory_title') }}</h3>
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_reset_factory_text_1') }}
                              <br>
                              <h3><b>{{ $t('message.settings_actions_reset_factory_text_1') }}</b></h3>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog = false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="restore">
                                <b>{{ $t('message.settings_actions_reset_factory_restore') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                      <!-- Logs -->
                      <v-dialog v-model="dialog_logs" width="700">
                        <!-- eslint-disable-next-line vue/no-unused-vars -->
                        <template v-slot:activator="data">
                          <v-btn slot="activator" color="warning" dark>
                            <v-icon>fas fa-file-signature</v-icon> {{ $t('message.settings_actions_show_logs') }}
                          </v-btn>
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              <h3>CoderBot - {{ $t('message.settings_actions_show_logs_title') }}</h3>
                            </v-card-title>
                            <div class="cardContent">
                              <div v-for="value, key in cb.logs.log" :key="key">
                                {{ value }}
                              </div>
                            </div>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_logs = false">
                                {{ $t('message.close') }}
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </div>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left"> {{ $t('message.settings_actions_update_title') }} </h3>
                  <v-card>
                    <div class="cardContent">
                      <template v-if="updateStatus==1">
                        {{ $t('message.settings_update_upload') }}
                        <h3>{{ counter }} %</h3>
                        <br>
                        {{ updateStatusText }}
                      </template>
                      <template v-if="updateStatus==2">
                      </template>
                      <template v-if="updateStatus==0">
                        <v-text-field v-bind:label="$t('message.settings_update_upload')" @click='pickFile' v-model='fileName'
                          prepend-icon='attach_file'></v-text-field>
                        <input type="file" style="display: none" ref="file" @change="onFilePicked">
                        <template v-if="this.fileObj">{{ $t('message.settings_update_text') }}<br></template>
                        <v-btn v-if="this.fileObj" @click="upload" color="error">{{ $t('message.ok') }}</v-btn>
                      </template>
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
                <!-- Column A -->
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t('message.settings_movement_control') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-text-field v-model="settings.ctrlFwdSpeed"
                        v-bind:label="$t('message.settings_movement_control_forward_speed')" />
                      <v-text-field v-model="settings.ctrlFwdElapse"
                        v-bind:label="$t('message.settings_movement_control_forward_elapse')" />
                      <v-text-field v-model="settings.ctrlTurnSpeed"
                        v-bind:label="$t('message.settings_movement_control_turn_speed')" />
                      <v-text-field v-model="settings.ctrlTurnElapse"
                        v-bind:label="$t('message.settings_movement_control_turn_elapse')" />
                    </div>
                  </v-card>
                  <br><br>
                  <h3 class="text-xs-left">{{ $t('message.settings_movement_program') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-text-field v-model="settings.moveFwdSpeed"
                        v-bind:label="$t('message.settings_movement_program_forward_speed')" />
                      <v-text-field v-model="settings.moveFwdElapse"
                        v-bind:label="$t('message.settings_movement_program_forward_elapse')" />
                      <v-text-field v-model="settings.moveTurnSpeed"
                        v-bind:label="$t('message.settings_movement_program_turn_speed')" />
                      <v-text-field v-model="settings.moveTurnElapse"
                        v-bind:label="$t('message.settings_movement_program_turn_elapse')" />
                    </div>
                  </v-card>
                  <br><br>
                  <h3 class="text-xs-left">{{ $t('message.settings_movement_parameters') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-text-field v-model="settings.motorMode"
                        v-bind:label="$t('message.settings_movement_parameters_mode')" />
                      <v-text-field v-model="settings.trimFactor"
                        v-bind:label="$t('message.settings_movement_parameters_trim')" />
                      <v-text-field v-model="settings.power[0]"
                        v-bind:label="$t('message.settings_movement_parameters_power_1')" />
                      <v-text-field v-model="settings.power[1]"
                        v-bind:label="$t('message.settings_movement_parameters_power_2')" />
                      <v-text-field v-model="settings.power[2]"
                        v-bind:label="$t('message.settings_movement_parameters_power_3')" />
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
                  <h3 class="text-xs-left">{{ $t('message.settings_sounds_title') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-text-field v-model="settings.startSound" v-bind:label="$t('message.settings_sounds_start')" />
                      <v-text-field v-model="settings.stopSound" v-bind:label="$t('message.settings_sounds_stop')" />
                      <v-text-field v-model="settings.shutterSound" v-bind:label="$t('message.settings_sounds_shutter')" />
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
                  <h3 class="text-xs-left">{{ $t('message.settings_button_title') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-radio-group v-model="settings.btnFun" column>
                        <v-radio v-bind:label="$t('message.settings_button_none')" value="none" />
                        <v-radio v-bind:label="$t('message.settings_button_startstop')" value="startstop" />
                      </v-radio-group>
                    </div>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left">{{ $t('message.settings_load_at_start_title') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-text-field v-model="settings.startupProgram" v-bind:label="$t('message.settings_load_at_start_title')" />
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t('message.settings_network_title') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-radio-group v-model="settings.wifiMode" column>
                        <v-radio v-bind:label="$t('message.settings_network_mode_client')" value="client"></v-radio>
                        <v-radio v-bind:label="$t('message.settings_network_mode_ap')" value="ap">
                        </v-radio>
                        <v-text-field v-model="settings.wifiSSID" v-bind:label="$t('message.settings_network_ssid')"></v-text-field>
                        <v-text-field v-model="settings.wifiPsw" v-bind:label="$t('message.settings_network_password')"></v-text-field>
                      </v-radio-group>
                      <v-card-actions>
                        <v-btn color="primary" @click.stop="dialog = true" block>Salva</v-btn>
                        <v-dialog v-model="dialog" max-width="290">
                          <v-card>
                            <v-card-title class="text-h5">
                              {{ $t('message.settings_network_save_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_network_save_text_1') }}
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="secondary" @click="dialog = false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="primary" @click="dialog = false; saveWifi">
                                {{ $t('message.ok') }}
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-card-actions>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-text>
            </v-card-text>
          </v-tab-item>
          <!-- TEST TAB -->
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t('message.settings_component_test_title') }}</h3>
                  <v-card>

                    <div class="cardContent">
                      <div id='test_array'>
                        <!-- SONAR -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-flex xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_sonar')" value="sonar" v-model="checkedTests" color="orange"></v-switch>
                          </v-flex>
                          <!-- button state -->
                          <v-flex xs12 md4>
                            <span v-if="cb.logs.test != null && cb.logs.test.sonar != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.sonar == 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon>fas fa-check</v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon>fas fa-times</v-icon> {{ $t('message.settings_component_test_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon>fas fa-question</v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-flex>
                        </v-layout>
                        <!-- MOTORS -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-flex xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_motors')" value="motors" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-flex>
                          <!-- button state -->
                          <v-flex xs12 md4>
                            <span v-if="cb.logs.test != null && cb.logs.test.motors != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.motors== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon>fas fa-check</v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon>fas fa-times</v-icon> {{ $t('message.settings_component_test_not_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon>fas fa-question</v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-flex>
                        </v-layout>

                        <!-- SPEAKER -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-flex xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_speaker')" value="speaker" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-flex>
                          <!-- button state -->
                          <v-flex xs12 md4>
                            <span v-if="cb.logs.test != null && cb.logs.test.speaker != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.speaker== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon>fas fa-check</v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon>fas fa-times</v-icon> {{ $t('message.settings_component_test_not_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon>fas fa-question</v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-flex>
                        </v-layout>

                        <!-- OCR -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-flex xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_ocr')" value="ocr" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-flex>
                          <!-- button state -->
                          <v-flex xs12 md4>
                            <span v-if="cb.logs.test != null && cb.logs.test.ocr != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.ocr== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon>fas fa-check</v-icon> {{ $t('message.settings_component_test_not_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon>fas fa-times</v-icon> {{ $t('message.settings_component_test_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon>fas fa-question</v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-flex>
                        </v-layout>
                      </div>
                      <br>
                      <v-card-actions>

                        <v-btn v-if="!cb.logs.runningTest" block @click="runTests" slot="activator" color="orange" dark>
                          <v-icon>fas fa-running</v-icon> {{ $t('message.settings_component_test_run') }}
                        </v-btn>
                        <v-btn v-else block disabled>
                          <v-icon>fas fa-ellipsis-h</v-icon> {{ $t('message.settings_component_test_text_1') }}
                        </v-btn>
                      </v-card-actions>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>

          <!-- AUDIO TAB -->
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t('message.settings_audio_title') }}</h3>
                  <v-card>
                    <div class="cardContent">
                      {{ $t('message.settings_audio_volume') }}<v-text-field v-model="settings.audioLevel" v-bind:label="$t('message.settings_audio_volume')" />
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>

          <!-- PACKAGE MANAGER -->
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t('message.settings_music_packages_title') }}</h3>
                  <br>
                  <h3 class="text-xs-left"> {{ $t('message.settings_music_packages_installed') }}</h3>
                  <v-card v-for="pkgnames in settings.packagesInstalled" v-bind:key="pkgnames.key">
                    <div class="cardContent">
                      <li> nome: <b>{{pkgnames[0][0]}}</b> {{ $t('message.settings_music_packages_type') }} <b>{{pkgnames[1]}} </b><span
                          style="display: flex; justify-content: flex-end">
                          <v-btn @click="deletePkg(pkgnames[0][1])" color="red" dark>
                            <v-icon>fas fa-trash</v-icon> {{ $t('message.settings_music_packages_remove') }}
                          </v-btn>
                        </span>
                      </li>
                    </div>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left"> {{ $t('message.settings_music_packages_add') }} </h3>
                  <v-card>
                    <div class="cardContent">
                      <template v-if="updateStatus==1">
                        <b>{{ $t('message.settings_music_package_installed') }}</b>
                        <br>
                        {{ updateStatusText }}
                        <v-btn @click="refresh" color="error">{{ $t('message.settings_music_packages_update') }}</v-btn>
                      </template>
                      <template v-if="updateStatus==2 || updateStatus==3">
                        <b>{{ $t('message.settings_music_packages_installation_failed') }}</b>
                        <br>
                        {{ updateStatusText }}
                        <v-btn @click="refresh" color="error">{{ $t('message.settings_music_packages_update') }}</v-btn>
                      </template>
                      <template v-if="updateStatus==0">
                        <v-text-field label="$t('message.settings_music_packages_select')" @click='pickFile' v-model='fileName'
                          prepend-icon='attach_file'></v-text-field>
                        <input type="file" style="display: none" ref="file" @change="onFilePicked">
                        <template v-if="this.fileObj">{{ $t('message.settings_music_packages_install_confirm_text') }}<br></template>
                        <v-btn v-if="this.fileObj" @click="uploadPackage" color="error">{{ $t('message.settings_music_packages_install_confirm') }}</v-btn>
                      </template>
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
      </v-main>
      <!-- Notification Snackbar -->
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="pink" text @click="snackbar = false">
          {{ $t('message.close') }}
        </v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>
<script>
import sidebar from '../components/Sidebar';

export default {
  components: {
    sidebar
  },
  name: 'Settings',
  mounted() {
    this.pollStatus();
    setInterval(() => {
      this.pollStatus();
    }, 1000);
    this.getInfoAndStatus();
    this.prepopulate();
    this.loadMusicPackages();
  },
  methods: {
    pickFile() {
      this.$refs.file.click();
    },
    onFilePicked(e) {
      const {
        files
      } = e.target;
      this.fileName = files[0].name;
      this.fileObj = files[0];
      this.formdata = new FormData();
      this.formdata.append('file_to_upload', files[0], files[0].name);
    },
    loadMusicPackages() {
      this.$axios.get(`${this.CB}/listMusicPackages`).then((result) => {
        this.settings.packagesInstalled = [];
        const music_packages = JSON.parse(result.data);
        Object.entries(music_packages).forEach((key) => {
          const package_key = key[0];
          const music_package = key[1];
          const names = [music_package.name_IT, package_key];
          if (music_package.category == 'instrument') {
            this.settings.packagesInstalled.push([names, 'instrument']);
          } else if (music_package.category == 'animal') {
            this.settings.packagesInstalled.push([names, 'animal']);
          }
        });
      });
    },
    uploadPackage() {
      /*
      const qs = this.$qs;
      const pkgName = qs.stringify({
        nameID: this.fileName,
      });
      */
      this.$axios.post(`${this.CB}/updatePackages`, this.formdata).then((result) => {
        this.updateStatus = result.data;
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_1');
        console.dir(result.data);
        if (this.updateStatus == 2) {
          this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_2');
        }
        if (this.updateStatus == 3) {
          this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_3');
        }
      });
    },

    upload() {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          this.counter = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        },
      };
      this.updateStatus = 1;
      this.$axios.post(`${this.CB}/updateFromPackage`, this.formdata, config).then((result) => {
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        console.dir(result.data);
        this.updateStatusText = this.$i18n.t('message.settings_packages_text_1');
      });
    },

    refresh() {
      window.location.reload();
      /*    readTextFile
          this.packagesInstalled = packageList
          this.$http.get('vue/index.html#/settings').then((results) => {
                console.log(results.data.data);
                }, (results) => {
                    console.log('ERROR');
                    console.log(results);
                  });
*/
    },
    /*       readTextFile(file, callback) {
          var rawFile = new XMLHttpRequest();
          rawFile.overrideMimeType("application/json");
          rawFile.open("GET", file, true);
          rawFile.onreadystatechange = function() {
              if (rawFile.readyState === 4 && rawFile.status == "200") {
                  callback(rawFile.responseText);
              }
          }
          rawFile.send(null);
      },
*/
    restoreConfig() {
      const axios = this.$axios;
      const {
        CB
      } = this;
      axios.post(`${CB}/restoreSettings`)
        .then(() => {
          this.snackText = this.$i18n.t('message.settings_packages_reset_complete');
          this.snackbar = true;
          this.prepopulate();
        });
    },
    runTests() {
      const axios = this.$axios;
      const {
        CB
      } = this;
      this.cb.logs.runningTest = true;
      axios.post(`${CB}/testCoderbot`, {
        params: this.checkedTests
      }).then((response) => {
        this.cb.logs.test = response.data;
        this.snackText = 'Running tests';
        this.snackbar = true;
        this.prepopulate();
        this.cb.logs.runningTest = false;
      });
    },
    restore() {
      const axios = this.$axios;
      const {
        CB
      } = this;
      axios.post(`${CB}/reset`)
        .then(() => {
          this.snackText = this.$i18n.t('message.settings_packages_reset_text_1');
          this.snackbar = true;
          this.prepopulate();
          setTimeout(() => this.dialog.close(), 5000);
          this.dialog = false;
        });
    },
    shutdown() {
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'halt'
        }
      }).then(function success() {
        this.snackText = this.$i18n.t('message.coderbot_status_shutting_down');
        this.snackbar = true;
      });
    },
    reboot() {
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      axios.get(`${CBv1}/bot`, {
        params: {
          cmd: 'reboot'
        }
      }).then(function success() {
        this.snackText = this.$i18n.t('message.coderbot_status_restart_start');
        this.snackbar = true;
      });
    },
    getInfoAndStatus() {
      // Get bot info and status
      const axios = this.$axios;
      axios.get(`${this.CB}/status`)
        .then((response) => {
          this.cb.status = response.data;
          this.cb.logs.log = response.data.log;
        });
      axios.get(`${this.CB}/info`)
        .then((response) => {
          this.cb.info = response.data;
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
            this.getInfoAndStatus();
            this.prepopulate();
          }
          this.statusData = response.data;
          this.status = response.status;
          this.cb.logs.log = response.data.log;
        })
        .catch((error) => {
          // handle error
          console.log(error);
          if (this.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_online');
            this.snackbar = true;
          }
          this.status = 0;
        });
    },
    deletePkg(pkgNameID) {
      const axios = this.$axios;
      axios.post(`${this.CB}/deleteMusicPackage`, {
        package_name: pkgNameID,
      }).then(() => {
        console.log('Pacchetto rimosso');
        this.snackText = this.$i18n.t('message.settings_music_package_removed');
        this.snackbar = true;
        this.loadMusicPackages();
      });
    },
    prepopulate() {
      const axios = this.$axios;
      // Prepopulate settings
      axios.get(`${this.CBv1}/config`)
        .then((response) => {
          // handle success
          const data = this.settings;
          console.log(response.data);
          const remoteConfig = response.data;
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
          data.power = [remoteConfig.move_power_angle_1, remoteConfig.move_power_angle_2, remoteConfig
            .move_power_angle_3
          ];
          data.btnFun = remoteConfig.button_func;
          data.wifiMode = remoteConfig.wifi_mode;
          data.wifiSSID = remoteConfig.wifi_ssid;
          data.wifiPsw = remoteConfig.wifi_psk;
          data.motorMode = remoteConfig.move_motor_mode;
          data.trimFactor = remoteConfig.move_motor_trim;
          data.startSound = remoteConfig.sound_start;
          data.stopSound = remoteConfig.sound_stop;
          data.shutterSound = remoteConfig.sound_shutter;
          data.startupProgram = remoteConfig.load_at_start;
          data.progLevel = remoteConfig.prog_level;
          data.moveFwdElapse = remoteConfig.move_fw_elapse;
          data.moveFwdSpeed = remoteConfig.move_fw_speed;
          data.moveTurnElapse = remoteConfig.move_tr_elapse;
          data.moveTurnSpeed = remoteConfig.move_tr_speed;
          data.ctrlFwdElapse = remoteConfig.ctrl_fw_elapse;
          data.ctrlFwdSpeed = remoteConfig.ctrl_fw_speed;
          data.ctrlTurnElapse = remoteConfig.ctrl_tr_elapse;
          data.ctrlTurnSpeed = remoteConfig.ctrl_tr_speed;
          data.audioLevel = remoteConfig.audio_volume_level;
          data.packagesInstalled = remoteConfig.packages_installed;
        });
    },
    save() {
      const qs = this.$qs;
      const selectedTab = this.tab;
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      const data = this.settings;
      if (selectedTab != 4) {
        const legacySettings = qs.stringify({
          wifi_mode: data.wifiMode,
          wifi_ssid: data.wifiSSID,
          wifi_psk: data.wifiPsw,
          move_power_angle_1: data.power[0],
          move_power_angle_2: data.power[1],
          move_power_angle_3: data.power[2],
          button_func: data.btnFun,
          move_motor_mode: data.motorMode,
          move_motor_trim: data.trimFactor,
          sound_start: data.startSound,
          sound_stop: data.stopSound,
          sound_shutter: data.shutterSound,
          load_at_start: data.startupProgram,
          prog_level: data.progLevel,
          move_fw_elapse: data.moveFwdElapse,
          move_fw_speed: data.moveFwdSpeed,
          move_tr_elapse: data.moveTurnElapse,
          move_tr_speed: data.moveTurnSpeed,
          ctrl_fw_elapse: data.ctrlFwdElapse,
          ctrl_fw_speed: data.ctrlFwdSpeed,
          ctrl_tr_elapse: data.ctrlTurnElapse,
          ctrl_tr_speed: data.ctrlTurnSpeed,
          audio_volume_level: data.audioLevel,
          packages_installed: data.packagesInstalled,
        });
        axios.post(`${CBv1}/config`, legacySettings)
          .then(() => {
            console.log('Updated settings');
            this.prepopulate();
            this.snackText = this.$i18n.t('message.settings_updated');
            this.snackbar = true;
          });
      }
    },
    saveWifi() {
      const qs = this.$qs;
      const axios = this.$axios;
      const {
        CBv1
      } = this;
      const valuesAsString = qs.stringify({
        wifi_mode: this.settings.wifiMode,
        wifi_ssid: this.settings.wifiSSID,
        wifi_psk: this.settings.wifiPsw,
      });
      // Send post with URL encoded parameters
      axios.post(`${CBv1}/wifi`, valuesAsString)
        .then(() => {
          console.log('Sent');
          this.snackText = this.$i18n.t('message.settings_network_updated');
          this.snackbar = true;
        });
      console.log(`save wifi config - ssid: ${this.settings.wifiSSID}  pwd: ${this.settings.wifiPsw}`);
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
  },
  data() {
    return {
      formdata: null,
      files: null,
      status: null,
      dialog: false,
      dialog_logs: false,
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

        cbName: 'CoderBot',
        power: [null, null, null],
        btnFun: null,
        wifiMode: 'ap',
        wifiSSID: null,
        wifiPsw: null,

        audioLevel: null,
        packagesInstalled: null,
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
        {
          text: this.$i18n.t('message.settings_toolbax_movement'),
          value: 'basic_move'
        },
        {
          text: this.$i18n.t('message.settings_toolbax_base'),
          value: 'basic'
        },
        {
          text: this.$i18n.t('message.settings_toolbax_standard'),
          value: 'std'
        },
        {
          text: this.$i18n.t('message.settings_toolbax_advanced'),
          value: 'adv'
        },
      ],
      cb: {
        info: {
          status: null,
          internetConnectivity: null,
          temp: null,
          uptime: null,
        },
        status: {
          model: null,
          serial: null,
          cbVersion: null,
          backendVersion: null,
          vueVersion: null,
          kernel: null,
          motors: null,
        },
        logs: {
          log: null,
          test: null,
          runningTest: false,
        },
      },
      drawer: null,
      tab: null,
      tabs: [
        this.$i18n.t('message.settings_tabs_general'),
        this.$i18n.t('message.settings_tabs_movement'),
        this.$i18n.t('message.settings_tabs_sounds'),
        this.$i18n.t('message.settings_tabs_advanced'),
        this.$i18n.t('message.settings_tabs_network'),
        this.$i18n.t('message.settings_tabs_test'),
        this.$i18n.t('message.settings_tabs_audio'),
        this.$i18n.t('message.settings_tabs_music_packages')
      ],
    };
  },
};
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
