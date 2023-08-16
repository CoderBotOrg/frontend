<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo">
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title"><div>{{ $t("message.settings_title") }}</div></v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="save" id="save">
          <v-icon icon="mdi-content-save"></v-icon>
          {{ $t('message.save') }}
        </v-btn>
        <template v-slot:extension v-if="!requirePassword">
          <v-tabs slot="extension" v-model="tab" centered slider-color="white">
            <v-tab v-for="(item, index) in tabs" :key="item" :id="index">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-main>
        <v-window v-model="tab" v-if="!requirePassword">
          <v-window-item>
            <v-container>
              <v-row>
                <!-- Column A -->
                <v-col >
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_actions') }}
                    </v-card-title>
                    <v-card-text>
                    <div class="d-flex justify-space-around align-center">
                      <v-btn color="info" @click="dialog_shutdown=true">
                        <v-icon icon="mdi-power"></v-icon> {{ $t('message.settings_actions_halt') }}
                      </v-btn>
                      <v-btn color="info" @click="dialog_restart=true">
                        <v-icon icon="mdi-restart"></v-icon> {{ $t('message.settings_actions_restart') }}
                      </v-btn>
                      <v-btn color="info" @click="dialog_reboot=true">
                        <v-icon icon="mdi-restart"></v-icon> {{ $t('message.settings_actions_reboot') }}
                      </v-btn>
                      <v-btn color="warning" @click="dialog_restore=true">
                        <v-icon icon="mdi-restore"></v-icon> {{ $t('message.settings_actions_restore') }}
                      </v-btn>
                      <v-btn slot="activator" color="error" dark @click="dialog_reset=true">
                        <v-icon icon="mdi-store-cog"></v-icon> {{ $t('message.settings_actions_reset') }}
                      </v-btn>
                      <!-- ** Restore button + dialog box** -->
                      <v-dialog v-model="dialog_shutdown" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              CoderBot - {{ $t('message.settings_actions_halt_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_halt_text_1') }}
                              {{ $t('message.settings_actions_halt_text_2') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_shutdown=false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="reboot">
                                {{ $t('message.settings_actions_halt') }}
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                      <v-dialog v-model="dialog_restart" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              CoderBot - {{ $t('message.settings_actions_restart_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_restart_text_1') }}
                              {{ $t('message.settings_actions_restart_text_2') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_restart=false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="reboot">
                                <b>{{ $t('message.settings_actions_restart') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                      <v-dialog v-model="dialog_reboot" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              CoderBot - {{ $t('message.settings_actions_reboot_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_reboot_text_1') }}
                              {{ $t('message.settings_actions_reboot_text_2') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_reboot=false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="reboot">
                                <b>{{ $t('message.settings_actions_reboot') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                      <v-dialog v-model="dialog_restore" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              CoderBot - {{ $t('message.settings_actions_restore_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_restore_text_1') }}
                              {{ $t('message.settings_actions_restore_text_2') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_restore = false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="restoreSettings">
                                <b>{{ $t('message.settings_actions_restore') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                      <v-dialog v-model="dialog_reset" width="500">
                          <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                              CoderBot - {{ $t('message.settings_actions_reset_title') }}
                            </v-card-title>
                            <v-card-text>
                              {{ $t('message.settings_actions_reset_text_1') }}
                              {{ $t('message.settings_actions_reset_text_2') }}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="dialog_reset = false">
                                {{ $t('message.cancel') }}
                              </v-btn>
                              <v-btn color="error" @click="reset">
                                <b>{{ $t('message.settings_actions_reset_do') }}</b>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>
                    </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col >
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_admin_password_title') }}
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="settings.adminPassword"
                        v-bind:label="$t('message.settings_admin_password')"
                        @input="v$.settings.adminPassword.$touch"
                        @update:focused="passwordVerified=true"
                        id="settings_password"
                        :append-icon="settings_password_show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="settings_password_show ? 'text' : 'password'"
                        @click:append="settings_password_show = !settings_password_show"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                <v-card>
                  <v-card-title>
                    {{ $t("message.settings_locale") }}
                  </v-card-title>
                  <v-card-text>
                    <v-select v-model="settings.locale"
                      :items="langs"
                      item-title="text"
                      item-value="key"
                      v-bind:label="$t('message.settings_locale')" required
                      @change="v$.settings.locale.$touch"
                    ></v-select>
                  </v-card-text>
                </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_general_info') }}
                    </v-card-title>
                    <v-card-text>
                      <v-expansion-panels>
                        <v-expansion-panel
                          :title="$t('message.settings_status')"
                        >
                          <v-expansion-panel-text>
                            <div v-for="(value, key) in cb.status" :key="key">
                              <div v-if="key != 'log'">
                                {{ key }}: <code>{{ value }}</code>
                              </div>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel
                         :title="$t('message.settings_info')"
                          >
                          <v-expansion-panel-text>
                            <div v-for="(value, key) in cb.info" :key="key">
                              <div v-if="key != 'log'">
                                {{ key }}: <code>{{ value }}</code>
                              </div>
                            </div>
                          </v-expansion-panel-text>
                          </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container>
              <v-row>
                <!-- Column A -->
                <v-col cols="6">
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_movement_control') }}
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="settings.ctrlFwdSpeed"
                        v-bind:label="$t('message.settings_movement_control_forward_speed')"
                        @input="v$.settings.ctrlFwdSpeed.$touch"
                        v-bind:error-messages="v$.settings.ctrlFwdSpeed.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_movement_control_forward_speed"
                      />
                      <v-text-field v-model="settings.ctrlFwdElapse"
                        v-bind:label="$t('message.settings_movement_control_forward_elapse')"
                        @input="v$.settings.ctrlFwdElapse.$touch"
                        v-bind:error-messages="v$.settings.ctrlFwdElapse.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_control_forward_elapse"
                      />
                      <v-text-field v-model="settings.ctrlTurnSpeed"
                        v-bind:label="$t('message.settings_movement_control_turn_speed')"
                        @input="v$.settings.ctrlTurnSpeed.$touch"
                        v-bind:error-messages="v$.settings.ctrlTurnSpeed.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_movement_control_turn_speed"
                      />
                      <v-text-field v-model="settings.ctrlTurnElapse"
                        v-bind:label="$t('message.settings_movement_control_turn_elapse')"
                        @input="v$.settings.ctrlTurnElapse.$touch"
                        v-bind:error-messages="v$.settings.ctrlTurnElapse.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_control_turn_elapse"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_movement_program') }}
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="settings.moveFwdSpeed"
                        v-bind:label="$t('message.settings_movement_program_forward_speed')"
                        @input="v$.settings.moveFwdSpeed.$touch"
                        v-bind:error-messages="v$.settings.moveFwdSpeed.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_movement_program_forward_speed"
                      />
                      <v-text-field v-model="settings.moveFwdElapse"
                        v-bind:label="$t('message.settings_movement_program_forward_elapse')"
                        @input="v$.settings.moveFwdElapse.$touch"
                        v-bind:error-messages="v$.settings.moveFwdElapse.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_program_forward_elapse"
                      />
                      <v-text-field v-model="settings.moveTurnSpeed"
                        v-bind:label="$t('message.settings_movement_program_turn_speed')"
                        @input="v$.settings.moveTurnSpeed.$touch"
                        v-bind:error-messages="v$.settings.moveTurnSpeed.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_movement_program_turn_speed"
                      />
                      <v-text-field v-model="settings.moveTurnElapse"
                        v-bind:label="$t('message.settings_movement_program_turn_elapse')"
                        @input="v$.settings.moveTurnElapse.$touch"
                        v-bind:error-messages="v$.settings.moveTurnElapse.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_program_turn_elapse"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_movement_parameters') }}
                    </v-card-title>
                    <v-card-title>
                      <v-text-field v-model="settings.trimFactor"
                        v-bind:label="$t('message.settings_movement_parameters_trim')"
                        @input="v$.settings.trimFactor.$touch"
                        v-bind:error-messages="v$.settings.trimFactor.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_parameters_trim"
                      />
                      <v-text-field v-model="settings.motorMinPower"
                        v-bind:label="$t('message.settings_motor_min_power')"
                        @input="v$.settings.motorMinPower.$touch"
                        v-bind:error-messages="v$.settings.motorMinPower.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_motor_min_power"
                      />
                      <v-text-field v-model="settings.motorMaxPower"
                        v-bind:label="$t('message.settings_motor_max_power')"
                        @input="v$.settings.motorMaxPower.$touch"
                        v-bind:error-messages="v$.settings.motorMaxPower.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_motor_max_power"
                      />
                    </v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_movement_parameters_pid') }}
                    </v-card-title>
                    <v-card-title>
                      <v-text-field v-model="settings.pidMaxSpeed"
                        v-bind:label="$t('message.settings_movement_parameters_pid_max_speed')"
                        @input="v$.settings.pidMaxSpeed.$touch"
                        v-bind:error-messages="v$.settings.pidMaxSpeed.$error == true ? $t('message.validation_integer') : ''"
                        id="settings_movement_parameters_pid_max_speed"
                      />
                      <v-text-field v-model="settings.pidSampleTime"
                        v-bind:label="$t('message.settings_movement_parameters_pid_sample_rate')"
                        @input="v$.settings.pidSampleTime.$touch"
                        v-bind:error-messages="v$.settings.pidSampleTime.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_parameters_pid_sample_rate"
                      />
                      <v-text-field v-model="settings.pidKP"
                        v-bind:label="$t('message.settings_movement_parameters_pid_kp')"
                        @input="v$.settings.pidKP.$touch"
                        v-bind:error-messages="v$.settings.pidKP.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_parameters_pid_kp"
                      />
                      <v-text-field v-model="settings.pidKD"
                        v-bind:label="$t('message.settings_movement_parameters_pid_kd')"
                        @input="v$.settings.pidKD.$touch"
                        v-bind:error-messages="v$.settings.pidKD.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_parameters_pid_kd"
                      />
                      <v-text-field v-model="settings.pidKI"
                        v-bind:label="$t('message.settings_movement_parameters_pid_ki')"
                        @input="v$.settings.pidKI.$touch"
                        v-bind:error-messages="v$.settings.pidKI.$error == true ? $t('message.validation_decimal') : ''"
                        id="settings_movement_parameters_pid_ki"
                      />
                    </v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_motion_parameters') }}
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="settings.power[0]"
                        v-bind:label="$t('message.settings_movement_parameters_power_1')"
                      />
                      <v-text-field v-model="settings.power[1]"
                        v-bind:label="$t('message.settings_movement_parameters_power_2')"
                      />
                      <v-text-field v-model="settings.power[2]"
                        v-bind:label="$t('message.settings_movement_parameters_power_3')"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap>
                <!-- Column A -->
                <v-col >
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_camera_title') }}
                    </v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="settings.camera_exposure_mode"
                        :items="cameraExposureModes"
                        item-title="text"
                        item-value="key"
                        v-bind:label="$t('message.settings_camera_exposure_mode')"
                        single-line
                        @update:model-value="v$.settings.camera_exposure_mode.$touch"
                      ></v-select>
                      {{ $t("message.settings_camera_framerate") }}:
                      <span v-text="settings.camera_framerate"></span>
                      <v-slider v-model="settings.camera_framerate" min="5" max="30" step="5"
                        @update:model-value="v$.settings.camera_framerate.$touch"
                      />
                      {{ $t("message.settings_camera_jpeg_bitrate") }}:
                      <span v-text="settings.camera_jpeg_bitrate"></span>
                      <v-slider v-model="settings.camera_jpeg_bitrate" min="1000000" max="10000000" step="1000000"
                        v-bind:label="$t('message.settings_camera_jpeg_bitrate')"
                        @update:model-value="v$.settings.camera_jpeg_bitrate.$touch"
                        v-bind:error-messages="v$.settings.camera_jpeg_bitrate.$error == true ? $t('message.validation_integer') : ''"
                      />
                      {{ $t("message.settings_camera_jpeg_quality") }}:
                      <span v-text="settings.camera_jpeg_quality"></span>
                      <v-slider v-model="settings.camera_jpeg_quality" min="1" max="100" step="1"
                        v-bind:label="$t('message.settings_camera_jpeg_quality')"
                        @update:model-value="v$.settings.camera_jpeg_quality.$touch"
                        v-bind:error-messages="v$.settings.camera_jpeg_quality.$error == true ? $t('message.validation_integer') : ''"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_camera_cv_title') }}
                    </v-card-title>
                    <v-card-text>
                      {{ $t("message.settings_camera_cv_image_factor") }}:
                      <span v-text="settings.cv_image_factor"></span>
                      <v-slider v-model="settings.cv_image_factor" min="1" max="4" step="1"
                        @update:model-value="v$.settings.cv_image_factor.$touch"
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
                        @update:model-value="v$.settings.cnn_default_model.$touch" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap>
                <!-- Column A -->
                <v-col >
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_sounds_title') }}
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="settings.startSound" v-bind:label="$t('message.settings_sounds_start')"
                        @input="v$.settings.startSound.$touch"
                      />
                      <v-text-field v-model="settings.stopSound" v-bind:label="$t('message.settings_sounds_stop')"
                        @input="v$.settings.stopSound.$touch"
                      />
                      <v-text-field v-model="settings.shutterSound" v-bind:label="$t('message.settings_sounds_shutter')"
                        @input="v$.settings.shutterSound.$touch"
                      />
                   </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row>
                <!-- Column A -->
                <v-col>
                  <v-card>
                  <v-card-title>
                    {{ $t('message.settings_hardware_version') }}
                  </v-card-title>
                  <v-card-text>
                      <v-select
                        v-model="settings.hardwareVersion"
                        :items="hardware_version_items"
                        item-title="text"
                        item-value="key"
                        v-bind:label="$t('message.settings_hardware_version')"
                        single-line
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                  <v-card-title>
                    {{ $t('message.settings_button_title') }}
                  </v-card-title>
                  <v-card-text>
                      <v-radio-group v-model="settings.btnFun" column
                      >
                        <v-radio v-bind:label="$t('message.settings_button_none')" value="none"/>
                        <v-radio v-bind:label="$t('message.settings_button_startstop')" value="startstop" />
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  <v-card>
                  <v-card-title>
                    {{ $t('message.settings_load_at_start_title') }}
                  </v-card-title>
                  <v-card-text>
                      <v-select 
                        v-model="settings.startupProgram"
                        @update:model-value="v$.settings.startupProgram.$touch"
                        :items="programList"
                        item-title="name"
                        v-bind:label="$t('message.settings_load_at_start_title')"
                        single-line
                        >
                      </v-select>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap>
                <v-col >
                  <v-card>
                  <v-card-title>
                    {{ $t('message.settings_network_title') }}
                  </v-card-title>
                    <div>
                      <v-chip v-if="wifi_status.wifi" prepend-icon="mdi-wifi">Wifi</v-chip>
                      <v-chip v-if="wifi_status.internet" prepend-icon="mdi-web">Internet</v-chip>
                    </div>
                    <v-card-text>
                      <v-radio-group v-model="settings.wifiMode" column
                      >
                        <v-radio v-bind:label="$t('message.settings_network_mode_ap')" value="ap" @change="v$.settings.wifiMode.$touch"></v-radio>
                        <v-radio v-bind:label="$t('message.settings_network_mode_client')" value="client" @change="v$.settings.wifiMode.$touch"></v-radio>
                      </v-radio-group>
                      <div v-if="settings.wifiMode=='client'">
                        <v-select 
                        :disabled="settings.wifiMode!='client'"
                        v-model="settings.wifiSSID"
                        @update:model-value@update:model-value="v$.settings.wifiSSID.$touch"
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
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-card-text>
            </v-card-text>
          </v-window-item>
          <!-- TEST TAB -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap align-center>
                <v-col >
                  <v-card>
                    <v-card-title>
                      {{ $t('message.settings_component_test_title') }}
                    </v-card-title>
                    <v-card-text>
                      <div id='test_array' v-for="test in tests">
                        <v-row row wrap justify-center>
                          <v-col xs12 offset-md2 md5>
                            <v-switch :label="test.title" :value="test.name" v-model="checkedTests[test.name]" color="orange"></v-switch>
                          </v-col>
                          <v-col xs12 md4>
                            <v-chip slot="activator" :color="testStatusColor(test.name)" dark>
                              <v-icon icon="mdi-check"></v-icon> {{ testStatusLabel(test.name) }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn v-if="!testsRunning" block @click="runTests" slot="activator" color="orange" dark>
                        <v-icon icon="mdi-animation-play"></v-icon> {{ $t('message.settings_component_test_run') }}
                      </v-btn>
                      <v-btn v-else block>
                        <v-icon icon="mdi-clock-outline"></v-icon> {{ $t('message.settings_component_test_text_1') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>

          <!-- AUDIO TAB -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap align-center>
                <v-col >
                  <v-card>
                  <v-card-title>
                    {{ $t('message.settings_audio_title') }}
                  </v-card-title>
                    <v-card-text>
                      {{ $t('message.settings_audio_volume') }}
                      <v-text-field v-model="settings.audioLevel" v-bind:label="$t('message.settings_audio_volume')"
                        @input="v$.settings.audioLevel.$touch"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <!-- PACKAGE MANAGER -->
          <v-window-item>
            <v-container grid-list-md text-xs-center>
              <v-row row wrap align-center>
                <v-col >
                  <v-card>
                  <v-card-title>
                  <h4 class="text-xs-left"> {{ $t('message.settings_music_packages_installed') }}</h4>
                  </v-card-title>
                  <v-card-text>
                  <div v-for="pkgnames in musicPackages" v-bind:key="pkgnames[0]">
                    <b>{{pkgnames[0][0]}}</b> {{ $t('message.settings_music_packages_type') }} <b>{{pkgnames[1]}} </b><span
                        style="display: flex; justify-content: flex-end">
                        <v-btn @click="deletePkg(pkgnames[0][1])" color="red" dark>
                          <v-icon icon="mdi-delete"></v-icon> {{ $t('message.settings_music_packages_remove') }}
                        </v-btn>
                      </span>
                  </div>
                  </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-title>
                       {{ $t('message.settings_music_packages_add') }} 
                    </v-card-title>
                    <v-card-text>
                      <template v-if="updateStatus==0">
                        <v-text-field :label="$t('message.settings_music_packages_select')" @click='pickFile' v-model='fileName'
                          prepend-icon='attach_file'></v-text-field>
                        <input type="file" style="display: none" ref="file" @change="onFilePicked">
                        <template v-if="this.fileObj">{{ $t('message.settings_music_packages_install_confirm_text') }}<br></template>
                        <v-btn v-if="this.fileObj" @click="uploadPackage" color="error">{{ $t('message.settings_music_packages_install_confirm') }}</v-btn>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <!-- SYNC TAB -->
          <v-window-item>
            <sync :syncModesInit="settings.syncModes" v-model:syncModes="settings.syncModes"
                  :syncPeriodInit="settings.syncPeriod" v-model:syncPeriod="settings.syncPeriod"
                  @update:syncPeriod="(newValue) => {settings.syncPeriod = newValue; v$.settings.syncPeriod.$touch}"
                  v-bind:label="$t('message.settings_sync_period')"
                  ></sync>
          </v-window-item>
        </v-window>
      </v-main>
      <!-- Admin password dialog -->
      <v-dialog v-model="requirePassword" max-width="290" persistent>
        <v-card>
          <v-card-title class="headline">{{ $t("message.settings_admin_password_verify_title") }}</v-card-title>
          <v-card-text>
            {{ $t("message.settings_admin_password_verify") }}
            <v-text-field v-model="adminPassword"
            id="settings_password_verify"
            :append-icon="settings_password_verify_show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="settings_password_verify_show ? 'text' : 'password'"
            @click:append="settings_password_verify_show = !settings_password_verify_show"
            v-bind:error-messages="passwordIncorrect == true ? $t('message.settings_admin_password_incorrect') : ''"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="adminPassword_dialog=false; $router.go(-1);">
              {{ $t("message.cancel") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="checkAdminPassword()"
            id="settings_password_verify_ok">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Confirm exit dialog -->
      <v-dialog v-model="confirm_exit_dialog" max-width="290" id="confirm_exit_dialog">
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
<script lang="js">
import useVuelidate from '@vuelidate/core';
import {
  required, alpha, integer, decimal, between, minValue, maxValue
} from '@vuelidate/validators';
import i18n from '../i18n';

import sidebar from './Sidebar.vue';
import sync from './Sync.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    sidebar,
    sync
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
    this.interval_wifi = setInterval(() => {this.pollWifiStatus()}, 1000);
    this.interval_info = setInterval(() => {this.pollInfo()}, 1000);
    this.$wifi_connect.networks().then((result) => {
      this.networks = result.data.ssids;
    });
    this.$coderbot.listPrograms()
      .then((response) => {
        this.programList = [{name:"", code:"", dom_code:"", default: false}];
        this.programList = this.programList.concat(response.data);
      });
    this.musicPackages = this.$store.getters.musicPackages;
  },
  unmounted() {
    clearInterval(this.interval_wifi);
    clearInterval(this.interval_info);
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
    },
    requirePassword() {
      return this.settings.adminPassword != null && this.settings.adminPassword != '' && !this.passwordVerified;
    },
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
      this.$coderbot.uploadMusicPackage(this.formdata).then((result) => {
        console.log(result);
        this.updateStatus = 0;
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.fileObj = null;
        this.fileName = null;
        this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_1');
        this.$coderbot.loadMusicPackages().then(() => {
          this.musicPackages = this.$store.getters.musicPackages;
        });
      }).catch((result) => {
        console.log(result);
        this.updateStatus = 0;
        this.uploadCompleted = true;
        this.uploadInProgress = false;
        this.fileObj = null;
        this.fileName = null;
        this.updateStatusText = this.$i18n.t('message.settings_music_packages_text_3');
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
      this.$coderbot.loadMusicPackages();
      this.musicPackages = this.$store.getters.musicPackages;
    },
    pollWifiStatus() {
      this.$wifi_connect.status().then((result) => {
        this.wifi_status = result.data;
      });
    },
    pollInfo() {
      this.$coderbot.getInfo();
      this.settings = this.$store.getters.settings;
      this.cb.status = this.$store.getters.status;
      this.cb.info = this.$store.getters.info;
    },
    restoreSettings() {
      this.$coderbot.restoreSettings()
        .then(() => {
          this.snackText = this.$i18n.t('message.settings_packages_reset_complete');
          this.snackbar = true;
        });
    },
    runTests() {
      this.runningTest = true;
      let tests = Object.values(this.checkedTests);
      this.$coderbot.test(tests).then((response) => {
        console.log(response.data);
        this.testResults = response.data;
        this.snackText = 'Running tests';
        this.snackbar = true;
        this.testsRunning = false;
      });
    },
    reset() {
      this.$coderbot.reset().then(() => {
        this.dialog_restore = false;
        this.snackText = this.$i18n.t('message.settings_reset_text_1');
        this.snackbar = true;
      });
    },
    shutdown() {
      this.$coderbot.halt().then(() => {
        console.log(response);
        this.dialog_shutdown = false;
        this.snackText = this.$i18n.t('message.coderbot_status_shutting_down');
        this.snackbar = true;
      });
    },
    reboot() {
      this.$coderbot.reboot().then(() => {
        this.dialog_reboot = false;
        this.snackText = this.$i18n.t('message.coderbot_status_rebooting');
        this.snackbar = true;
      });
    },
    deletePkg(pkgNameID) {
      this.$coderbot.deleteMusicPackage(pkgNameID).then(() => {
        console.log('Pacchetto rimosso');
        this.snackText = this.$i18n.t('message.settings_music_package_removed');
        this.snackbar = true;
        this.$coderbot.loadMusicPackages().then(() => {
          this.musicPackages = this.$store.getters.musicPackages;
        });
      });
    },
    save() {
      if (this.v$.$invalid) {
        console.log(this.v$)
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
          this.snackText = this.$i18n.t('message.settings_updated') + (needRestartFlag ? this.$i18n.t('message.settings_restart_needed') : '');
          this.snackbar = true;
          this.v$.settings.$reset();
          console.log('set dirty false');
        });
        if (this.v$.settings.wifiMode.$dirty || this.v$.settings.wifiSSID.$dirty || this.v$.settings.wifiPsw.$dirty) {
          if(this.settings.wifiMode=="client") {
            const network = this.networks.find(item => { return item.ssid==this.settings.wifiSSID });
            if(network != null) {
              console.log("connecting");
              this.$wifi_connect.connect(network.ssid, network.conn_type, this.settings.wifiUser, this.settings.wifiPsw)
                .then((result) => {
                  console.log("connected: ", result.data);
                  this.snackText = this.$i18n.t('message.settings_network_updated');
                  this.snackbar = true;
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          } else {
            console.log("disconnecting");
            this.$wifi_connect.disconnect().then((result) => {
              console.log("disconnected: ", result.data);
            });
          }
        }
      }
    },
    testStatusColor(name) {
      switch (this.testResults[name]) {
        case 1:
          return "green";
        case -1:
          return "red";
        case 0:
          return "default";
      }
    },
    testStatusLabel(name) {
      switch (this.testResults[name]) {
        case 1:
          return this.$i18n.t('message.settings_component_test_passed');
        case -1:
          return this.$i18n.t('message.settings_component_test_failed');
        case 0:
          return this.$i18n.t('message.settings_component_test_not_tested');
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
        motorMinPower: true,
        motorMaxPower: true,
        moveFwdElapse: false,
        moveFwdSpeed: false,
        moveTurnElapse: false,
        moveTurnSpeed: false,
        ctrlFwdElapse: false,
        ctrlFwdSpeed: false,
        ctrlTurnElapse: false,
        ctrlTurnSpeed: false,
        trimFactor: true,
        pidKP: true,
        pidKD: true,
        pidKI: true,
        pidMaxSpeed: true,
        pidSampleTime: true,
        startSound: true,
        stopSound: true,
        shutterSound: true,
        startupProgram: true,
        progLevel: false
      };
    },
    checkAdminPassword() {
      if (this.settings.adminPassword == this.adminPassword) {
        this.passwordVerified = true;
        this.passwordIncorrect = false;
      } else {
        this.passwordIncorrect = true;
      }
    }
  },
  data() {
    return {
      formdata: null,
      files: null,
      dialog_shutdown: false,
      dialog_reboot: false,
      dialog_restart: false,
      dialog_restore: false,
      dialog_reset: false,
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
        motorMinPower: null,
        motorMaxPower: null,
        moveFwdElapse: null,
        moveFwdSpeed: null,
        moveTurnElapse: null,
        moveTurnSpeed: null,
        ctrlFwdElapse: null,
        ctrlFwdSpeed: null,
        ctrlTurnElapse: null,
        ctrlTurnSpeed: null,
        trimFactor: null,
        pidKP: null,
        pidKD: null,
        pidKI: null,
        pidMaxSpeed: null,
        pidSampleTime: null,
        startSound: null,
        stopSound: null,
        shutterSound: null,
        startupProgram: null,
        progLevel: null,
        adminPassword: null,
        locale: null,
        syncModes: null,
        syncPeriod: null,
      },
      musicPackages: null,
      cb: {
        info: {},
        status: {},
        logs: {},
      },
      drawer: null,
      tab: null,
      cnnModels: [],
      dirty: false,
      confirm_exit_dialog: null,
      router_next: null,
      adminPassword: null,
      adminPassword_dialog: false,
      tabs: [
        this.$i18n.t('message.settings_tabs_general'),
        this.$i18n.t('message.settings_tabs_movement'),
        this.$i18n.t('message.settings_tabs_camera'),
        this.$i18n.t('message.settings_tabs_sounds'),
        this.$i18n.t('message.settings_tabs_advanced'),
        this.$i18n.t('message.settings_tabs_network'),
        this.$i18n.t('message.settings_tabs_test'),
        this.$i18n.t('message.settings_tabs_audio'),
        this.$i18n.t('message.settings_tabs_music_packages'),
        this.$i18n.t('message.settings_tabs_cloud_sync')
      ],
      tests: [
        { name: "sonar", title: this.$i18n.t('message.settings_component_test_sonar') },
        { name: "motors", title: this.$i18n.t('message.settings_component_test_motors') },
        { name: "speaker", title: this.$i18n.t('message.settings_component_test_speaker') },
        { name: "OCR", title: this.$i18n.t('message.settings_component_test_ocr') },
      ],
      testResults: {
        sonar: null,
        motors: null,
        speaker: null,
        OCR: null,
      },
      testsRunning: false,
      networks: [],
      wifi_status: null,
      wifi_pwd_show: false,
      programList: [],
      settings_password_show: false,
      settings_password_verify_show: false,
      passwordVerified: false,
      passwordIncorrect: false,
      interval_wifi: null,
      interval_info: null,
      langs: [
        { key: 'browser', text: this.$i18n.t('message.activity_lang_browser') },
        { key: 'it', text: this.$i18n.t('message.activity_lang_italian') },
        { key: 'en', text: this.$i18n.t('message.activity_lang_english') },
        { key: 'fr', text: this.$i18n.t('message.activity_lang_french') },
        { key: 'es', text: this.$i18n.t('message.activity_lang_spanish') },
        { key: 'de', text: this.$i18n.t('message.activity_lang_german') },
      ],
    };
  },
  validations() {
    return {
      settings: {
        cv_image_factor: {
          required
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
        motorMinPower: {
          required,
          decimal,
          minValue: between(0, 100)
        },
        motorMaxPower: {
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
        pidMaxSpeed: {
          required,
          integer,
          minValue: 0,
          maxValue: maxValue(300)
        },
        pidSampleTime: {
          required,
          decimal,
          minValue: 0,
        },
        pidKP: {
          required,
          decimal
        },
        pidKD: {
          required,
          decimal
        },
        pidKI: {
          required,
          decimal
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
        },
        adminPassword: {
        },
        locale: {
        },
        syncPeriod: {
          required,
          integer,
          minValue: minValue(10),
          maxValue: maxValue(300)
        },
      },
    };
  },
});
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
