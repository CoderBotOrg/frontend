<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo">
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>{{ $t("message.settings_title") }}</div></v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-if="status == 200">
          <v-btn text @click="save">
            <v-icon icon="mdi-content-save"></v-icon>
            {{ $t('message.save') }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn text>
            <v-progress-circular :size="30" :width="2" indeterminate></v-progress-circular>
          </v-btn>
        </template>
        <template v-slot:extension>
          <v-tabs slot="extension" v-model="tab" centered slider-color="white">
            <v-tab v-for="item in tabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-main>
        <v-window v-model="tab">
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-col xs12 md6 offset-md3>
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
                    <div class="d-flex justify-space-around align-center">
                      <v-btn @click="shutdown" color="info">
                        <v-icon icon="mdi-power"></v-icon> {{ $t('message.settings_actions_off') }}
                      </v-btn>
                      <v-btn @click="reboot" color="info">
                        <v-icon icon="mdi-restart"></v-icon> {{ $t('message.settings_actions_restart') }}
                      </v-btn>
                      <v-btn @click="restoreConfig" color="warning">
                        <v-icon icon="mdi-restore"></v-icon> {{ $t('message.settings_actions_reset') }}
                      </v-btn>
                      <v-btn slot="activator" color="error" dark @click="dialog_reset = true">
                        <v-icon icon="mdi-store-cog"></v-icon> {{ $t('message.settings_actions_reset_factory') }}
                      </v-btn>
                      <v-btn slot="activator" color="warning" dark @click="dialog_logs = true">
                        <v-icon icon="mdi-format-list-text"></v-icon> {{ $t('message.settings_actions_show_logs') }}
                      </v-btn>
                      <!-- ** Restore button + dialog box** -->
                      <v-dialog v-model="dialog_reset" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              <h3>CoderBot - {{ $t('message.settings_actions_reset_factory_title') }}</h3>
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_reset_factory_text_1') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_reset = false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="restore">
                                <b>{{ $t('message.settings_actions_reset_factory_restore') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                      <!-- Logs -->
                      <v-dialog v-model="dialog_logs" width="700">
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
                      </v-dialog>
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_admin_password_title') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.adminPassword"
                        v-bind:label="$t('message.settings_admin_password')"
                        @input="v$.settings.motorMode.$touch"
                      />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-col xs12 md6 offset-md3>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_movement_control') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.ctrlFwdSpeed"
                        v-bind:label="$t('message.settings_movement_control_forward_speed')"
                        @input="v$.settings.ctrlFwdSpeed.$touch"
                        v-bind:error-messages="v$.settings.ctrlFwdSpeed.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.ctrlFwdElapse"
                        v-bind:label="$t('message.settings_movement_control_forward_elapse')"
                        @input="v$.settings.ctrlFwdElapse.$touch"
                        v-bind:error-messages="v$.settings.ctrlFwdElapse.$error == true ? $t('message.validation_decimal') : ''"
                      />
                      <v-text-field v-model="settings.ctrlTurnSpeed"
                        v-bind:label="$t('message.settings_movement_control_turn_speed')"
                        @input="v$.settings.ctrlTurnSpeed.$touch"
                        v-bind:error-messages="v$.settings.ctrlTurnSpeed.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.ctrlTurnElapse"
                        v-bind:label="$t('message.settings_movement_control_turn_elapse')"
                        @input="v$.settings.ctrlTurnElapse.$touch"
                        v-bind:error-messages="v$.settings.ctrlTurnElapse.$error == true ? $t('message.validation_decimal') : ''"
                      />
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_movement_program') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.moveFwdSpeed"
                        v-bind:label="$t('message.settings_movement_program_forward_speed')"
                        @input="v$.settings.moveFwdSpeed.$touch"
                        v-bind:error-messages="v$.settings.moveFwdSpeed.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.moveFwdElapse"
                        v-bind:label="$t('message.settings_movement_program_forward_elapse')"
                        @input="v$.settings.moveFwdElapse.$touch"
                        v-bind:error-messages="v$.settings.moveFwdElapse.$error == true ? $t('message.validation_decimal') : ''"
                      />
                      <v-text-field v-model="settings.moveTurnSpeed"
                        v-bind:label="$t('message.settings_movement_program_turn_speed')"
                        @input="v$.settings.moveTurnSpeed.$touch"
                        v-bind:error-messages="v$.settings.moveTurnSpeed.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.moveTurnElapse"
                        v-bind:label="$t('message.settings_movement_program_turn_elapse')"
                        @input="v$.settings.moveTurnElapse.$touch"
                        v-bind:error-messages="v$.settings.moveTurnElapse.$error == true ? $t('message.validation_decimal') : ''"
                      />
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_movement_parameters') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.motorMode"
                        v-bind:label="$t('message.settings_movement_parameters_mode')"
                        @input="v$.settings.motorMode.$touch"
                      />
                      <v-text-field v-model="settings.trimFactor"
                        v-bind:label="$t('message.settings_movement_parameters_trim')"
                        @input="v$.settings.trimFactor.$touch"
                        v-bind:error-messages="v$.settings.trimFactor.$error == true ? $t('message.validation_decimal') : ''"
                      />
                      <v-text-field v-model="settings.power[0]"
                        v-bind:label="$t('message.settings_movement_parameters_power_1')"
                      />
                      <v-text-field v-model="settings.power[1]"
                        v-bind:label="$t('message.settings_movement_parameters_power_2')"
                      />
                      <v-text-field v-model="settings.power[2]"
                        v-bind:label="$t('message.settings_movement_parameters_power_3')"
                      />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-col xs12 md6 offset-md3>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_camera_title') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      <v-select
                        v-model="settings.camera_exposure_mode"
                        :items="cameraExposureModes"
                        item-title="text"
                        item-value="key"
                        v-bind:label="$t('message.settings_camera_exposure_mode')"
                        single-line
                        @select="v$.settings.camera_exposure_mode.$touch"
                      ></v-select>
                      {{ $t("message.settings_camera_framerate") }}:
                      <span v-text="settings.camera_framerate"></span>
                      <v-slider v-model="settings.camera_framerate" min="5" max="30" step="5"
                        @change="v$.settings.camera_framerate.$touch"
                      />
                      {{ $t("message.settings_camera_jpeg_bitrate") }}:
                      <span v-text="settings.camera_jpeg_bitrate"></span>
                      <v-slider v-model="settings.camera_jpeg_bitrate" min="1000000" max="10000000" step="1000000"
                        v-bind:label="$t('message.settings_camera_jpeg_bitrate')"
                        @change="v$.settings.camera_jpeg_bitrate.$touch"
                        v-bind:error-messages="v$.settings.camera_jpeg_bitrate.$error == true ? $t('message.validation_integer') : ''"
                      />
                      {{ $t("message.settings_camera_jpeg_quality") }}:
                      <span v-text="settings.camera_jpeg_quality"></span>
                      <v-slider v-model="settings.camera_jpeg_quality" min="1" max="100" step="1"
                        v-bind:label="$t('message.settings_camera_jpeg_quality')"
                        @change="v$.settings.camera_jpeg_quality.$touch"
                        v-bind:error-messages="v$.settings.camera_jpeg_quality.$error == true ? $t('message.validation_integer') : ''"
                      />
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                    <v-card-title>
                      <h3 class="text-xs-left">{{ $t('message.settings_camera_cv_title') }}</h3>
                    </v-card-title>
                    <div class="cardContent">
                      {{ $t("message.settings_camera_cv_image_factor") }}:
                      <span v-text="settings.cv_image_factor"></span>
                      <v-slider v-model="settings.cv_image_factor" min="1" max="4" step="1"
                        @change="v$.settings.cv_image_factor.$touch"
                      />
                      <v-text-field v-model="settings.camera_color_object_size_max"
                        @input="v$.settings.camera_color_object_size_max.$touch"
                        v-bind:label="$t('message.settings_camera_color_object_size_max')"
                        v-bind:error-messages="v$.settings.camera_color_object_size_max.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.camera_color_object_size_min"
                        @input="v$.settings.camera_color_object_size_min.$touch"
                        v-bind:label="$t('message.settings_camera_color_object_size_min')"
                        v-bind:error-messages="v$.settings.camera_color_object_size_min.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.camera_path_object_size_max"
                        @input="v$.settings.camera_path_object_size_max.$touch"
                        v-bind:label="$t('message.settings_camera_path_object_size_max')"
                        v-bind:error-messages="v$.settings.camera_path_object_size_max.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-text-field v-model="settings.camera_path_object_size_min"
                        @input="v$.settings.camera_path_object_size_min.$touch"
                        v-bind:label="$t('message.settings_camera_path_object_size_min')"
                        v-bind:error-messages="v$.settings.camera_path_object_size_min.$error == true ? $t('message.validation_integer') : ''"
                      />
                      <v-select
                        v-model="settings.cnn_default_model"
                        :items="cnnModels"
                        item-title="text"
                        item-value="key"
                        v-bind:label="$t('message.settings_camera_cnn_default_model')"
                        @select="v$.settings.cnn_default_model.$touch" />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_sounds_title') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.startSound" v-bind:label="$t('message.settings_sounds_start')"
                        @input="v$.settings.startSound.$touch"
                      />
                      <v-text-field v-model="settings.stopSound" v-bind:label="$t('message.settings_sounds_stop')"
                        @input="v$.settings.stopSound.$touch"
                      />
                      <v-text-field v-model="settings.shutterSound" v-bind:label="$t('message.settings_sounds_shutter')"
                        @input="v$.settings.shutterSound.$touch"
                      />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_hardware_version') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      <v-select
                        v-model="settings.hardwareVersion"
                        :items="hardware_version_items"
                        item-title="text"
                        item-value="key"
                        v-bind:label="$t('message.settings_hardware_version')"
                        single-line
                      />
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_button_title') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      <v-radio-group v-model="settings.btnFun" column
                      >
                        <v-radio v-bind:label="$t('message.settings_button_none')" value="none"/>
                        <v-radio v-bind:label="$t('message.settings_button_startstop')" value="startstop" />
                      </v-radio-group>
                    </div>
                  </v-card>
                  <br>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_load_at_start_title') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      <v-text-field v-model="settings.startupProgram" v-bind:label="$t('message.settings_load_at_start_title')"
                        @input="v$.settings.startupProgram.$touch"
                      />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_network_title') }}</h3>
                  </v-card-title>
                    <div>
                      <v-chip v-if="wifi_status.wifi" prepend-icon="mdi-wifi">Wifi</v-chip>
                      <v-chip v-if="wifi_status.internet" prepend-icon="mdi-web">Internet</v-chip>
                    </div>
                    <div class="cardContent">
                      <v-radio-group v-model="settings.wifiMode" column
                        @change="v$.settings.wifiMode.$touch"
                      >
                        <v-radio v-bind:label="$t('message.settings_network_mode_ap')" value="ap"></v-radio>
                        <v-radio v-bind:label="$t('message.settings_network_mode_client')" value="client"></v-radio>

                      </v-radio-group>
                      <div v-if="settings.wifiMode=='client'">
                        <v-select 
                        :disabled="settings.wifiMode!='client'"
                        v-model="settings.wifiSSID"
                        @change="v$.settings.wifiSSID.$touch"
                        :items="networks"
                        item-title="ssid"
                        item-value="ssid"
                        v-bind:label="$t('message.settings_network_ssid')"
                        single-line
                        >
                        </v-select>
                        <v-text-field 
                        v-if="network_require_user"
                        :disabled="settings.wifiMode!='client'"
                        v-model="settings.wifiUser"
                        @change="v$.settings.wifiUser.$touch"
                        v-bind:label="$t('message.settings_network_username')"></v-text-field>
                        <v-text-field 
                        :disabled="settings.wifiMode!='client'"
                        v-model="settings.wifiPsw"
                        @change="v$.settings.wifiPsw.$touch"
                        :append-icon="wifi_pwd_show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="wifi_pwd_show ? 'text' : 'password'"
                        @click:append="wifi_pwd_show = !wifi_pwd_show"
                        v-bind:label="$t('message.settings_network_password')"></v-text-field>
                      </div>
                      <!--v-card-actions>
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
                              <v-btn color="primary" @click="dialog = false; saveWifi();">
                                {{ $t('message.ok') }}
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-card-actions-->
                    </div>
                    <template>
                      <div class="text-center">
                        <v-dialog
                          v-model="wifi_overlay"
                          persistent
                        >
                          <v-card>
                            <v-card-text>
                              <div class="text-center">
                                {{ $t('message.settings_network_wait') }}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
            <v-card-text>
            </v-card-text>
          </v-window-item>
          <!-- TEST TAB -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_component_test_title') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      <div id='test_array'>
                        <!-- SONAR -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-col xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_sonar')" value="sonar" v-model="checkedTests" color="orange"></v-switch>
                          </v-col>
                          <!-- button state -->
                          <v-col xs12 md4>
                            <span v-if="cb.logs != null && cb.logs.test != null && cb.logs.test.sonar != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.sonar == 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon icon="mdi-check"></v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon icon="mdi-exclamation"></v-icon> {{ $t('message.settings_component_test_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon icon="mdi-help"></v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-col>
                        </v-layout>
                        <!-- MOTORS -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-col xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_motors')" value="motors" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-col>
                          <!-- button state -->
                          <v-col xs12 md4>
                            <span v-if="cb.logs != null && cb.logs.test != null && cb.logs.test.motors != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.motors== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon icon="mdi-check"></v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon icon="mdi-exclamation"></v-icon> {{ $t('message.settings_component_test_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon icon="mdi-help"></v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-col>
                        </v-layout>

                        <!-- SPEAKER -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-col xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_speaker')" value="speaker" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-col>
                          <!-- button state -->
                          <v-col xs12 md4>
                            <span v-if="cb.logs != null && cb.logs.test != null && cb.logs.test.speaker != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.speaker== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon icon="mdi-check"></v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon icon="mdi-exclamation"></v-icon> {{ $t('message.settings_component_test_not_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon icon="mdi-help"></v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-col>
                        </v-layout>

                        <!-- OCR -->
                        <v-layout row wrap justify-center>
                          <!-- switch -->
                          <v-col xs12 offset-md2 md5>
                            <v-switch v-bind:label="$t('message.settings_component_test_ocr')" value="ocr" v-model="checkedTests" color="orange">
                            </v-switch>
                          </v-col>
                          <!-- button state -->
                          <v-col xs12 md4>
                            <span v-if="cb.logs != null && cb.logs.test != null && cb.logs.test.ocr != 0">
                              <!-- passed -->
                              <span v-if="cb.logs.test.ocr== 1">
                                <v-btn @click="runTests" slot="activator" color="green" dark>
                                  <v-icon icon="mdi-check"></v-icon> {{ $t('message.settings_component_test_passed') }}
                                </v-btn>
                              </span>
                              <!-- failed -->
                              <span v-else>
                                <v-btn @click="runTests" slot="activator" color="red" dark>
                                  <v-icon icon="mdi-exclamation"></v-icon> {{ $t('message.settings_component_test_failed') }}
                                </v-btn>
                              </span>
                            </span>
                            <!-- not tested -->
                            <span v-else>
                              <v-btn @click="runTests" slot="activator" color="grey" dark>
                                <v-icon icon="mdi-help"></v-icon> {{ $t('message.settings_component_test_not_tested') }}
                              </v-btn>
                            </span>
                          </v-col>
                        </v-layout>
                      </div>
                      <br>
                      <v-card-actions>

                        <v-btn v-if="cb.logs != null && !cb.logs.runningTest" block @click="runTests" slot="activator" color="orange" dark>
                          <v-icon icon="mdi-animation-play"></v-icon> {{ $t('message.settings_component_test_run') }}
                        </v-btn>
                        <v-btn v-else block disabled>
                          <v-icon icon="mdi-clock-outline"></v-icon> {{ $t('message.settings_component_test_text_1') }}
                        </v-btn>
                      </v-card-actions>
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>

          <!-- AUDIO TAB -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left">{{ $t('message.settings_audio_title') }}</h3>
                  </v-card-title>
                    <div class="cardContent">
                      {{ $t('message.settings_audio_volume') }}
                      <v-text-field v-model="settings.audioLevel" v-bind:label="$t('message.settings_audio_volume')"
                        @input="v$.settings.audioLevel.$touch"
                      />
                    </div>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
          <!-- PACKAGE MANAGER -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-col xs12 md6 offset-md3>
                  <v-card>
                  <v-card-title>
                  <h3 class="text-xs-left">{{ $t('message.settings_music_packages_title') }}</h3>
                  <br>
                  <h4 class="text-xs-left"> {{ $t('message.settings_music_packages_installed') }}</h4>
                  </v-card-title>
                  <v-card-text v-for="pkgnames in settings.packagesInstalled" v-bind:key="pkgnames.key">
                    <div class="cardContent">
                      <b>{{pkgnames[0][0]}}</b> {{ $t('message.settings_music_packages_type') }} <b>{{pkgnames[1]}} </b><span
                          style="display: flex; justify-content: flex-end">
                          <v-btn @click="deletePkg(pkgnames[0][1])" color="red" dark>
                            <v-icon icon="mdi-delete"></v-icon> {{ $t('message.settings_music_packages_remove') }}
                          </v-btn>
                        </span>
                    </div>
                  </v-card-text>
                  </v-card>
                  <br>
                  <h3 class="text-xs-left"> {{ $t('message.settings_music_packages_add') }} </h3>
                  <v-card>
                  <v-card-title>
                    <h3 class="text-xs-left"> {{ $t('message.settings_music_packages_add') }} </h3>
                  </v-card-title>
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
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
        </v-window>
      </v-main>
      <!-- Admin password dialog -->
      <v-dialog v-model="adminPassword_dialog" max-width="290" persistent>
        <v-card>
          <v-card-title class="headline">{{ $t("message.settings_admin_password_verify_title") }}</v-card-title>
          <v-card-text>
            {{ $t("message.settings_admin_password_verify") }}
            <v-text-field v-model="adminPassword"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="adminPassword_dialog=false; $router.go(-1);">
              {{ $t("message.cancel") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="checkAdminPassword()">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Confirm exit dialog -->
      <v-dialog v-model="confirm_exit_dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ $t("message.confirm") }}</v-card-title>
          <v-card-text>
            {{ $t("message.settings_confirm_exit_text") }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="confirm_exit_dialog=false">
              {{ $t("message.cancel") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="confirm_exit_dialog=false; router_next(true)">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import useVuelidate from '@vuelidate/core';
import {
  required, alpha, integer, decimal, between, minValue, maxValue
} from '@vuelidate/validators';

import sidebar from './Sidebar.vue';

export default {
  components: {
    sidebar
  },
  name: 'Settings',
  setup() {
    return {
      v$: useVuelidate(),
      cameraExposureModes: [
        { text: 'Auto', key: 'auto' },
        { text: 'Sports', key: 'sports' },
        { text: 'Night', key: 'night' },
        { text: 'Fixed FPS', key: 'fixedfps' },
        { text: 'Anti shake', key: 'antishake' },
        { text: 'Very long', key: 'verylong' }
      ],
      hardware_version_items: [
        { key: '4', text: '4.0 (legacy)' },
        { key: '5', text: '5.0 (latest)' }
      ],
    };
  },
  mounted() {
    this.pollStatus();
    setInterval(() => {
      this.pollStatus();
    }, 1000);
    this.getInfoAndStatus();
    this.prepopulate();
    this.settings.packagesInstalled = this.$store.getters.musicPackages;
    this.settings.cnnModels = this.$store.getters.cnnModels;
    this.cb.info = this.$store.getters.info;
    this.cb.status = this.$store.getters.status;
    this.adminPassword_dialog = this.settings.adminPassword != null && this.settings.adminPassword != '';
    this.$wifi_connect.networks().then((result) => {
     this.networks = result.data.ssids;
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.v$.$anyDirty) {
      this.router_next = next;
      this.confirm_exit_dialog = true;
    } else {
      next();
    }
  },
  computed: {
    network_require_user() {
      const network = this.networks.find(item => { return item.ssid==this.settings.wifiSSID });
      return network && network.conn_type == "ENTERPRISE";
    }
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
    uploadPackage() {
      /*
      const qs = this.$qs;
      const pkgName = qs.stringify({
        nameID: this.fileName,
      });
      */
      this.$coderbot.updatePackages(this.formData).then((result) => {
        this.updateStatus = result.data;
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_1');
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
      this.$$coderbot.updateFromPackage(this.formdata, config).then((result) => {
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.updateStatusText = this.$i18n.t('message.settings_packages_text_1');
      });
    },
    refresh() {
      window.location.reload();
      /*
      readTextFile
      this.packagesInstalled = packageList
      this.$http.get('vue/index.html#/settings').then((results) => {
            console.log(results.data.data);
            }, (results) => {
                console.log('ERROR');
                console.log(results);
              });
      readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
              callback(rawFile.responseText);
          }
      }
      rawFile.send(null);
      */
    },
    restoreConfig() {
      this.$coderbot.restoreSettings()
        .then(() => {
          this.snackText = this.$i18n.t('message.settings_packages_reset_complete');
          this.snackbar = true;
          this.prepopulate();
        });
    },
    runTests() {
      this.cb.logs.runningTest = true;
      this.$coderbot.test(this.checkedTests).then((response) => {
        this.cb.logs.test = response.data;
        this.snackText = 'Running tests';
        this.snackbar = true;
        this.prepopulate();
        this.cb.logs.runningTest = false;
      });
    },
    restore() {
      this.$coderbot.reset()
        .then(() => {
          this.snackText = this.$i18n.t('message.settings_packages_reset_text_1');
          this.snackbar = true;
          this.prepopulate();
          setTimeout(() => this.dialog.close(), 5000);
          this.dialog = false;
        });
    },
    shutdown() {
      this.$coderbot.halt().then(function success() {
        this.snackText = this.$i18n.t('message.coderbot_status_shutting_down');
        this.snackbar = true;
      });
    },
    reboot() {
      this.$coderbot.reboot().then(function success() {
        this.snackText = this.$i18n.t('message.coderbot_status_restart_start');
        this.snackbar = true;
      });
    },
    getInfoAndStatus() {
      // Get bot info and status
      return this.$coderbot.getInfoAndStatus();
    },
    pollStatus() {
      this.getInfoAndStatus()
        .then((response) => {
          if (this.status == 0 && response.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_online');
            this.snackbar = true;
            this.getInfoAndStatus();
            this.prepopulate();
          }
          this.status = this.$store.getters.status != null ? 200 : 500;
          this.cb.logs.log = this.$store.getters.status.log;
        })
        .catch((error) => {
          // handle error
          console.log(error);
          if (this.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_offline');
            this.snackbar = true;
          }
          this.status = 0;
        });
        this.$wifi_connect.status().then((result) => {
          this.wifi_status = result.data;
        });
    },
    deletePkg(pkgNameID) {
      this.$coderbot.deleteMusicPackage(pkgNameID).then(() => {
        console.log('Pacchetto rimosso');
        this.snackText = this.$i18n.t('message.settings_music_package_removed');
        this.snackbar = true;
      });
    },
    prepopulate() {
      this.settings = this.$store.getters.settings;
    },
    save() {
      if (this.v$.$invalid) {
        this.snackText = this.$i18n.t('message.settings_errors');
        this.snackbar = true;
      } else {
        /* eslint-disable func-names, object-shorthand, prefer-arrow-callback */
        const needRestart = this.needRestart();
        let needRestartFlag = false;
        Object.entries(this.v$.settings).forEach(function (field) {
          if (field[1].$dirty
            && needRestart[field[0]]) {
            needRestartFlag = true;
          }
        });
        this.$coderbot.saveSettings(this.settings).then(() => {
          console.log('Updated settings');
          this.prepopulate();
          this.snackText = this.$i18n.t('message.settings_updated') + (needRestartFlag ? this.$i18n.t('message.settings_restart_needed') : '');
          this.snackbar = true;
          this.v$.settings.$reset();
          console.log('set dirty false');
        });
        if (this.v$.settings.wifiMode.$dirty || this.v$.settings.wifiSSID.$dirty || this.v$.settings.wifiPsw.$dirty) {
          if(this.settings.wifiMode=="client") {
            const network = this.networks.find(item => { return item.ssid==this.settings.wifiSSID });
            if(network != null) {
              this.wifi_overlay = true;
              this.$wifi_connect.disconnect().then((result) => {
                setTimeout(() => {
                  this.$wifi_connect.connect(network.ssid, network.conn_type, this.settings.wifiUser, this.settings.wifiPsw)
                    .then((result) => {
                      this.snackText = this.$i18n.t('message.settings_network_updated');
                      this.snackbar = true;
                      this.wifi_overlay = false;
                    })
                    .catch((error) => {
                      console.error(error);
                      this.wifi_overlay = false;
                    });
                  }, 10000);
              })
              .catch((error) => {
                console.error(error);  
                this.wifi_overlay = false;
              });
            }
          }
        } else {
          this.$wifi_connect.disconnect().then((result) => {});
        }
      }
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
    errorMessages() { return !this.v$.settings.camera_color_object_size_max.required ? 'Valore numerico necessario' : null; },
    needRestart() {
      return {
        ctrl_hud_image: true,
        cv_image_factor: true,
        camera_color_object_size_max: true,
        camera_color_object_size_min: true,
        camera_exposure_mode: true,
        camera_framerate: true,
        camera_jpeg_bitrate: true,
        camera_jpeg_quality: true,
        camera_path_object_size_max: true,
        camera_path_object_size_min: true,
        cnn_default_model: true,
        cbName: true,
        btnFun: true,
        audioLevel: true,
        hardwareVersion: true,
        moveFwdElapse: false,
        moveFwdSpeed: false,
        moveTurnElapse: false,
        moveTurnSpeed: false,
        ctrlFwdElapse: false,
        ctrlFwdSpeed: false,
        ctrlTurnElapse: false,
        ctrlTurnSpeed: false,
        motorMode: true,
        trimFactor: true,
        startSound: true,
        stopSound: true,
        shutterSound: true,
        startupProgram: true,
        progLevel: false
      };
    },
    checkAdminPassword() {
      if (this.settings.adminPassword == this.adminPassword) {
        this.adminPassword_dialog = false;
      }
    }
  },
  data() {
    return {
      formdata: null,
      files: null,
      status: null,
      dialog_reset: false,
      dialog_logs: false,
      lastCommit: 'N/A',
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
        ctrl_hud_image: null,
        cv_image_factor: null,
        camera_color_object_size_max: null,
        camera_color_object_size_min: null,
        camera_exposure_mode: null,
        camera_framerate: null,
        camera_jpeg_bitrate: null,
        camera_jpeg_quality: null,
        camera_path_object_size_max: null,
        camera_path_object_size_min: null,
        cnn_default_model: null,

        cbName: 'CoderBot',
        power: [null, null, null],
        btnFun: null,
        wifiMode: 'ap',
        wifiSSID: null,
        wifiUser: null,
        wifiPsw: null,

        hardwareVersion: null,
        audioLevel: null,
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
        adminPassword: null,
      },
      cb: {
        logs: {
          log: []
        }
      },
      drawer: null,
      tab: null,
      cnnModels: [],
      dirty: false,
      confirm_exit_dialog: null,
      router_next: null,
      adminPassword: null,
      adminPassword_dialog: true,
      tabs: [
        this.$i18n.t('message.settings_tabs_general'),
        this.$i18n.t('message.settings_tabs_movement'),
        this.$i18n.t('message.settings_tabs_camera'),
        this.$i18n.t('message.settings_tabs_sounds'),
        this.$i18n.t('message.settings_tabs_advanced'),
        this.$i18n.t('message.settings_tabs_network'),
        this.$i18n.t('message.settings_tabs_test'),
        this.$i18n.t('message.settings_tabs_audio'),
        this.$i18n.t('message.settings_tabs_music_packages')
      ],
      networks: [],
      wifi_status: null,
      wifi_pwd_show: false,
      wifi_overlay: false,
    };
  },
  validations() {
    return {
      settings: {
        cv_image_factor: {
          required: true
        },
        camera_color_object_size_max: {
          required,
          integer,
          minValue: minValue(0)
        },
        camera_color_object_size_min: {
          required,
          integer,
          minValue: minValue(0)
        },
        camera_exposure_mode: {
          required,
          alpha
        },
        camera_framerate: {
          required,
          integer,
          between: between(0, 30)
        },
        camera_jpeg_bitrate: {
          required,
          integer,
          minValue: minValue(0)
        },
        camera_jpeg_quality: {
          required,
          integer,
          minValue: minValue(0)
        },
        camera_path_object_size_max: {
          required,
          integer,
          minValue: 0
        },
        camera_path_object_size_min: {
          required,
          integer,
          minValue: minValue(0)
        },
        cnn_default_model: {
          required
        },
        hardwareVersion: {
          required,
        },
        wifiMode: {
          required,
          alpha
        },
        wifiSSID: {
          required,
        },
        wifiUser: {
        },
        wifiPsw: {
          required,
        },
        audioLevel: {
          required,
          integer,
          between: between(0, 100)
        },
        moveFwdElapse: {
          required,
          decimal,
          minValue: minValue(-1.0)
        },
        moveFwdSpeed: {
          required,
          integer,
          between: between(0, 100)
        },
        moveTurnElapse: {
          required,
          decimal,
          minValue: minValue(-1.0)
        },
        moveTurnSpeed: {
          required,
          integer,
          between: between(0, 100)
        },
        ctrlFwdElapse: {
          required,
          decimal,
          minValue: minValue(-1.0)
        },
        ctrlFwdSpeed: {
          required,
          integer,
          between: between(0, 100)
        },
        ctrlTurnElapse: {
          required,
          decimal,
          minValue: minValue(-1.0)
        },
        ctrlTurnSpeed: {
          required,
          integer,
          minValue: 0,
          maxValue: maxValue(100)
        },
        motorMode: {
          required,
          alpha
        },
        trimFactor: {
          required,
          decimal
        },
        startSound: {
        },
        stopSound: {
        },
        shutterSound: {
        },
        startupProgram: {
        },
        progLevel: {
        }
      },
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
