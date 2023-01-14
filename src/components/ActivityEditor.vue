<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title class="title" v-if="!saved"><div>{{ $t("message.activity_new") }} {{prefix}} {{activity.name}}</div></v-app-bar-title>
        <v-app-bar-title class="title" v-else><div>{{ $t("message.activity_edit") }} {{prefix}} {{activity.name}}</div></v-app-bar-title>
        <v-btn text @click="save()" id="activity_save">
          <v-icon>save</v-icon>
          {{ $t("message.save") }}
        </v-btn>
        <template v-slot:extension>
          <v-tabs v-model="tab" align-with-title>
            <v-tab v-for="item in tabs" :key="item.key" :value="item.key" :id="item.key">
              {{ item.value }}
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-main>
        <v-window v-model="tab">
          <v-window-item key="general" value="general">
            <v-container grid-list-md text-xs-center>
              <v-row>
                <!-- Column A -->
                <v-col>
                  <p style="text-align: left">
                    <v-alert :value="true" type="info" style="font-size:16px">
                      {{ $t("message.activity_tip_1") }}
                    </v-alert>
                  </p>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                  <v-card>
                    <v-card-title>
                      {{ $t("message.activity_data") }}
                    </v-card-title>
                    <v-card-text>
                    <v-form>
                      <v-text-field v-model="activity.name" v-bind:label="$t('message.activity_name')" required id="name"
                        @input="v$.activity.name.$touch"
                        v-bind:error-messages="v$.activity.name.$error == true ? $t('message.validation_alphanum') : ''"
                      ></v-text-field>
                      <v-text-field v-model="activity.description" v-bind:label="$t('message.activity_description')" id="desc"
                        @input="v$.activity.description.$touch"
                        v-bind:error-messages="v$.activity.description.$error == true ? $t('message.validation_alphanum') : ''"
                      >
                      </v-text-field>
                      <v-select v-model="activity.defaultView" :items="views"
                        v-bind:label="$t('message.activity_predefined_view')" required
                        @input="v$.activity.defaultView.$touch"
                      ></v-select>
                      <v-checkbox
                        v-model="activity.default"
                        v-bind:label="$t('message.activity_default')"
                        @input="v$.activity.default.$touch"
                        id="is_default"
                      ></v-checkbox>
                    </v-form>
                  </v-card-text>
                  </v-card>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                  <v-card>
                    <v-card-title>
                      {{ $t("message.activity_typography") }}
                    </v-card-title>
                    <v-card-text>
                      <!--
											<v-select :items="fontSizeLabels" v-model="activity.fontSize" label="Grandezza testo"></v-select>
										-->
                      <v-switch v-bind:label="$t('message.activity_caps_only')" v-model="activity.capsSwitch">
                      </v-switch>
                      <v-switch v-bind:label="$t('message.activity_theme')" v-model="activity.theme" value="dark">
                      </v-switch>
                      <!--
											<v-layout row wrap>
												<v-col>
													<v-switch :label="`Modalità Daltonici`" v-model="daltonicSwitch"></v-switch>
												</v-col>
												<v-col>
													<v-select v-if="daltonicSwitch" v-model="daltonic" :items="daltonicModes" label="Tipo daltonismo" required></v-select>
												</v-col>
											</v-layout>
										-->
                    </v-card-text>
                  </v-card>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                  <v-card id="card_font_ui">
                    <v-card-title>
                      {{ $t("message.activity_typography_font_ui") }}
                    </v-card-title>
                    <v-card-text>
                      <span v-bind:style="bodyUIstyleObj">Lorem ipsum dolor sit amet</span>
                      <v-radio-group v-model="activity.bodyFont" column
                        v-bind:label="$t('message.activity_predefined_view')" required
                        @change="v$.activity.bodyFont.$touch"
                      >
                        <v-radio label="Roboto" value="Roboto"></v-radio>
                        <v-radio label="Open Sans" value="opensans"></v-radio>
                        <!--
												<v-radio label="Test Me (Altà leggibilità, indicato per dislessia)" value="testme"></v-radio>
												<v-radio label="Open-Dyslexic (Altà leggibilità, indicato per dislessia)" value="open-dys"></v-radio>
											-->
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                  <v-card id="card_font_editor">
                    <v-card-title>
                      {{ $t("message.activity_typography_font_editor") }}
                    </v-card-title>
                    <v-card-text>
                      <span v-bind:style="codeUIstyleObj">function life() { return 42; }</span>
                      <v-radio-group v-model="activity.codeFont" column
                        @change="v$.activity.codeFont.$touch"
                      >
                        <v-radio label="Ubuntu Mono" value="ubuntumono"></v-radio>
                        <v-radio label="Roboto Mono" value="robotomono"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                  <v-card>
                    <v-card-title>
                      {{ $t("message.activity_programing_title") }}
                    </v-card-title>
                    <v-card-text>
                      <v-layout row wrap>
                        <!--
												<v-col>
													<v-checkbox v-model="activity.availableViews" label="Programmazione a Blocchi" value="blockly"></v-checkbox>
												</v-col>
												<v-col>
													<v-checkbox v-model="activity.availableViews" label="Editor Python" value="python"></v-checkbox>
												</v-col>
                        -->
                        <v-col>
                          <v-checkbox v-model="activity.autoRecVideo"
                            v-bind:label="$t('message.activity_auto_rec_video')"
                            @input="v$.activity.autoRecVideo.$touch"
                          ></v-checkbox>
                        </v-col>
                        <v-col>
                          <v-text-field v-model="activity.maxBlocks"
                            v-bind:label="$t('message.activity_blocks_max_blocks')"
                            @input="v$.activity.maxBlocks.$touch"
                            v-bind:error-messages="v$.activity.maxBlocks.$error == true ? $t('message.validation_integer_positive') : ''"
                            ></v-text-field>
                        </v-col>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <!--
									<h3 class="text-xs-left">Funzionalità sperimentali</h3>
									<v-card>
										<div class="cardContent">
											<v-switch color="orange darken-3" :label="`Abilità funzionalità sperimentali`" v-model="experimental"></v-switch>
											<v-layout row wrap>
												<v-col>
													<v-switch v-if="experimental" :label="`Cronologia Modifiche`" v-model="editHistory"></v-switch>
												</v-col>
												<v-col>
													<v-switch v-if="editHistory" :label="`Permetti navigazione nella cronologia modifiche`" v-model="navHistory"></v-switch>
												</v-col>
											</v-layout>
											<v-switch v-if="experimental" :label="`Esecuzione passo passo`" v-model="stepbystep"></v-switch>
											<v-switch disabled v-if="experimental" :label="`Realtà Aumentata`" v-model="ar"></v-switch>
										</div>
									</v-card>
								-->
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item key="toolbar" value="toolbar">
            <v-container>
              <v-row>
                <v-col>
                  <h3> {{ $t("message.activity_toolbar_preview") }} </h3>
                  <v-app-bar>
                    <v-app-bar-nav-icon v-if="activity.drawerEnabled"></v-app-bar-nav-icon>
                    <v-app-bar-title v-if="activity.showName">{{ activity.name || $t("message.activity_name")}}
                    </v-app-bar-title>
                    <template v-for="button in activity.buttons">
                      <v-btn :color="button.colorBtn" :class="button.colorText">
                        <v-icon :icon="button.icon"></v-icon>
                        <span v-if="activity.showButtonLabel">{{ button.label }}</span>
                      </v-btn>
                    </template>
                  </v-app-bar>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-switch v-bind:label="$t('message.activity_lateral_menu_icon')" v-model="activity.drawerEnabled"
                    @change="v$.activity.drawerEnabled.$touch"
                  >
                  </v-switch>
                  <v-switch v-bind:label="$t('message.activity_name')" v-model="activity.showName"
                    @change="v$.activity.showName.$touch"
                  ></v-switch>
                  <v-switch v-bind:label="$t('message.activity_toolbar_buttons_show_label')" v-model="activity.showButtonLabel"
                    @change="v$.activity.showButtonLabel.$touch"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <h3> {{ $t("message.activity_toolbar_buttons") }} </h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn @click="addButton()" outlined color="green">
                    <v-icon icon="mdi-add"></v-icon> {{ $t("message.activity_toolbar_buttons_add") }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="restoreDefaults()" outlined color="blue">
                    <v-icon icon="mdi-undo"></v-icon> {{ $t("message.activity_toolbar_buttons_predefined") }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="removeAll()" outlined color="red">
                    <v-icon icon="mdi-clear"></v-icon> {{ $t("message.activity_toolbar_buttons_remove_all") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="button, i in activity.buttons" :key="i" :id="'button_index_'+i">
                    <v-card>
                      <v-card-title>
                      {{ $t("message.activity_toolbar_button") }} {{i + 1}}
                      <v-btn :color="button.colorBtn" :class="button.colorText">
                          {{ button.label }}
                          <v-icon right dark>{{ button.icon }}</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <span class="grey--text text--darken-2" v-if="button.notErasable">
                          {{ $t("message.activity_toolbar_buttons_cannot_remove_run") }} </span>
                        <v-text-field v-model="button.label" :label="$t('message.activity_label')"></v-text-field>
                        <v-select v-model="button.action" :items="actions" v-bind:label="$t('message.activity_action')"
                          :disabled="button.notErasable" item-title="text" item-value="value">
                        </v-select>
                        <v-select :items="textColors" v-model="button.colorText" item-title="text" item-value="value"
                          v-bind:label="$t('message.activity_text_color')"></v-select>
                        <v-layout row wrap>
                          <v-col xs4 style="text-align: left">
                              <div> {{ $t("message.activity_toolbar_buttons_color") }} </div>
                              <v-btn large :color="button.colorBtn" @click="b=i; colorPicker=true;"></v-btn>
                          </v-col>
                          <v-col xs4 style="text-align: left">
                            {{ $t("message.activity_toolbar_buttons_icon") }} <v-btn style="margin:0" large text
                              @click="b=i; iconPicker=true;" color="black">
                              <v-icon large color="black">{{ button.icon }}</v-icon>
                            </v-btn>
                          </v-col>
                        </v-layout>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn class="remove" @click="removeButton(i)" v-if="!button.notErasable">
                          <v-icon icon="mdi-close"></v-icon> {{ $t("message.activity_toolbar_buttons_remove") }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>           
                </v-col>
              </v-row>
            </v-container>
            <v-dialog v-model="colorPicker" max-width="600px">
              <v-card>
                <v-card-title class="headline">{{ $t("message.activity_toolbar_buttons_color_select") }}</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-color-picker class="ma-2" v-model="activity.buttons[b].colorBtn" :swatches="swatches" show-swatches></v-color-picker>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="colorPicker = false">{{ $t("message.close") }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="iconPicker" max-width="600px">
              <v-card>
                <v-card-title class="headline">{{ $t("message.activity_toolbar_buttons_icon_select") }}</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-layout row wrap>
                      <template v-for="icon, i in iconList" :key="icon.id">
                        <v-col xs1>
                          <v-icon large @click="activity.buttons[b].icon=icon; iconPicker = false">{{ icon }}</v-icon>
                        </v-col>
                        <template v-if="i%10==0">
                          <br :key="i">
                        </template>
                      </template>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-window-item>
          <v-window-item key="runtime" value="runtime">
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-col xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t("message.activity_views_title") }}</h3>
                  <v-card>
                    <v-card-text>
                    <v-form>
                      <v-switch v-bind:label='$t("message.activity_views_runtime_camera")'
                        v-model="activity.exec.camera"></v-switch>
                      <v-switch v-bind:label='$t("message.activity_views_runtime_log")'
                        v-model="activity.exec.log">
                      </v-switch>
                    </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-layout>
            </v-container>
          </v-window-item>
					<v-window-item key="toolbox" value="toolbox">
						<toolbox-editor
            v-model="activity.toolbox"
            :toolbox_in="activity.toolbox"
            />
					</v-window-item>
        </v-window>
      </v-main>
      <!-- Confirm exit dialog -->
      <v-dialog v-model="confirm_exit_dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ $t("message.confirm") }}</v-card-title>
          <v-card-text>
            {{ $t("message.activity_confirm_exit_text") }}
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
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}
      </v-snackbar>
    </v-app>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core';
// import VSwatches from 'vue3-swatches';

import {
  alphaNum, integer, minValue,
} from '@vuelidate/validators';

// import wsFactory from '../components/wsFactory';
import sidebar from './Sidebar.vue';
import ToolboxEditor from './ToolboxEditor.vue';

export default {
  name: 'ActivityEditor',
  components: {
    // VSwatches,
    sidebar,
    ToolboxEditor
  },
  setup() {
    return { v$: useVuelidate() };
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
    prefix() {
      if (this.activity.name != null && this.activity.name != '') return '-';
      return '';
    },
    bodyUIstyleObj() {
      const {
        bodyFont
      } = this.activity;
      let fontFamily = '';
      if (bodyFont == 'opensans') fontFamily = 'Open Sans';
      else if (bodyFont == 'roboto') fontFamily = 'Roboto';

      const obj = {
        fontSize: '36px',
        fontFamily,
        backgroundColor: '',
      };

      return obj;
    },
    codeUIstyleObj() {
      const {
        codeFont
      } = this.activity;
      let fontFamily = '';
      if (codeFont == 'ubuntumono') fontFamily = 'Ubuntu Mono';
      else if (codeFont == 'robotomono') fontFamily = 'Roboto Mono';

      const obj = {
        fontSize: '28px',
        fontFamily,
        backgroundColor: '',
      };
      return obj;
    },

  },
  data() {
    return {
      saved: false,
      snackbar: false,
      colorPicker: false,
      iconPicker: false,
      iconList: [
        'mdi-play',
        'mdi-pause',
        'mdi-stop',
        'mdi-close',
        'mdi-content-save',
        'mdi-content-save-edit',
        'mdi-autorenew',
        'mdi-wrench',
        'mdi-check-circle',
        'mdi-camera',
        'mdi-code-braces',
        'mdi-help',
        'mdi-check',
        'mdi-eject',
        'mdi-toy-brick',
        'mdi-emoticon',
        'mdi-star',
        'mdi-home',
        'mdi-timer-sand',
        'mdi-information',
        'mdi-translate',
        'mdi-chat-question',
        'mdi-book-search',
        'mdi-cog',
        'mdi-star-circle',
        'mdi-gamepad',
        'mdi-refresh',
        'mdi-replay',
        'mdi-volume-low',
        'mdi-volume-mute',
        'mdi-volume-high',
        'mdi-close-circle',
        'mdi-cancel',
        'mdi-plus'
      ],
      snackbarText: '',
      b: 0,
      activity: {
        stock: null,
        default: null,
        theme: null,
        defaultView: null,
        exec: {
          camera: true,
          log: true,
        },
        name: null,
        drawerEnabled: true,
        showName: true,
        showButtonLabel: true,
        buttons: null,
        description: null,
        fontSize: 'Medio',
        capsSwitch: true,
        bodyFont: 'Roboto',
        codeFont: 'ubuntumono',
        maxBlocks: 0,
        availableViews: [],
        viewSource: null,
        autoRecVideo: null,
        toolbox: {
          kind: 'flyoutToolbox',
          contents: []
        }
      },
      colors: ['red', 'pink', 'purple', 'yellow', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal',
        'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'black',
        'grey', 'black', 'white'
      ],
      textColors: [
        {
          text: this.$i18n.t('message.activity_button_text_white'),
          value: 'white--text',
        },
        {
          text: this.$i18n.t('message.activity_button_text_black'),
          value: 'black--text',
        },
      ],
      actions: [
        {
          text: this.$i18n.t('message.activity_program_clear'),
          value: 'clearProgram'
        },
        {
          text: this.$i18n.t('message.activity_program_run'),
          value: 'runProgram'
        },
        {
          text: this.$i18n.t('message.activity_program_save'),
          value: 'saveProgram'
        },
        {
          text: this.$i18n.t('message.activity_program_load'),
          value: 'loadProgramList'
        },
        {
          text: this.$i18n.t('message.activity_program_export'),
          value: 'exportProgram'
        },
        {
          text: this.$i18n.t('message.activity_program_import'),
          value: 'pickFile'
        },
        {
          text: this.$i18n.t('message.activity_program_save_as'),
          value: 'toggleSaveAs'
        },
        {
          text: this.$i18n.t('message.activity_program_show_code'),
          value: 'getProgramCode'
        },
      ],
      value: 0,
      fontSizeLabels: [
        this.$i18n.t('message.activity_font_size_s'),
        this.$i18n.t('message.activity_font_size_m'),
        this.$i18n.t('message.activity_font_size_l'),
        this.$i18n.t('message.activity_font_size_xl'),
      ],
      daltonicSwitch: 0,
      daltonicType: 1,
      daltonicModes: [
        'Deuteranomaly',
        'Protanomaly',
        'Protanopia',
      ],
      editHistory: false,
      navHistory: false,
      experimental: true,
      stepbystep: false,
      tab: null,
      tabs: [
        { key: 'general', value: this.$i18n.t('message.activity_tabs_general') },
        { key: 'toolbar', value: this.$i18n.t('message.activity_tabs_toolbar') },
        { key: 'runtime', value: this.$i18n.t('message.activity_tabs_runtime') },
        { key: 'toolbox', value: this.$i18n.t('message.activity_tabs_toolbox') }
      ],
      ar: false,
      // drawer: null,
      source: null,
      views: [
        {
          title: this.$i18n.t('message.activity_views_program'),
          value: 'blocks'
        }/*,
        {
          title: this.$i18n.t('message.activity_views_runtime'),
          value: 'exec',
          disabled: true
        },*/
      ],
      confirm_exit_dialog: null,
      route_next: null,
      dirty: false,
      unwatch: null
    };
  },
  validations() {
    return {
      activity: {
        default: { },
        defaultView: { },
        drawerEnabled: { },
        showName: { },
        showButtonLabel: { },
        buttons: { },
        fontSize: { },
        capsSwitch: { },
        bodyFont: { },
        codeFont: { },
        viewSource: { },
        autoRecVideo: { },
        name: { required: true, alphaNum },
        description: { },
        maxBlocks: { integer, minValue: minValue(0) }
      },
    };
  },
  mounted() {
    if (this.$route.params.name) {
      this.saved = true;
      this.$coderbot.loadActivity(this.$route.params.name, null).then((activity) => {
        this.activity = activity.data;
        if (this.activity.toolbox == null) {
          this.activity.toolbox = {
            kind: 'flyoutToolbox',
            contents: []
          };
        }
      });
    } else {
      this.restoreDefaults();
    }
    this.unwatch = this.$watch('activity', () => {
      this.dirty = true;
    }, { deep: true });
  },
  unmounted() {
    this.unwatch();
  },
  methods: {
    save() {
      if (this.activity.name) {
        this.$coderbot.saveActivity(this.activity).then(() => {
          this.snackbarText = this.$i18n.t('message.activity_saved');
          this.snackbar = true;
          this.saved = true;
          this.v$.$reset();
        });
      } else {
        this.snackbarText = this.$i18n.t('message.activity_save_error');
        this.snackbar = true;
      }
    },
    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },
    addButton() {
      this.activity.buttons.push({
        label: '',
      });
    },
    removeButton(index) {
      this.activity.buttons.splice(index, 1);
    },
    removeAll() {
      this.activity.buttons = [{
        label: this.$i18n.t('message.activity_program_run'),
        icon: 'play_arrow',
        colorBtn: 'green',
        colorText: 'white--text',
        action: 'runProgram',
        notErasable: true
      }];
    },
    restoreDefaults() {
      this.activity.buttons = [
        {
          action: 'clearProgramDlg',
          icon: 'mdi-close',
          label: this.$i18n.t('message.activity_program_clear'),
          type: 'text',
        },
        {
          action: 'saveProgram',
          icon: 'mdi-content-save',
          label: this.$i18n.t('message.activity_program_save'),
          type: 'text',
        },
        {
          action: 'toggleSaveAs',
          icon: 'mdi-content-save-edit',
          label: this.$i18n.t('message.activity_program_save_as'),
          type: 'text',
        },
        {
          action: 'loadProgramList',
          icon: 'mdi-folder-open',
          label: this.$i18n.t('message.activity_program_load'),
          type: 'text',
        },
        {
          action: 'runProgram',
          icon: 'mdi-play',
          label: this.$i18n.t('message.activity_program_run'),
          type: 'text',
        },
        {
          action: 'getProgramCode',
          icon: 'mdi-code-braces',
          label: this.$i18n.t('message.activity_program_show_code'),
          type: 'text',
        },
        {
          action: 'exportProgram',
          icon: 'mdi-export',
          label: this.$i18n.t('message.activity_program_export'),
          type: 'text',
        },
        {
          action: 'pickFile',
          icon: 'mdi-import',
          label: this.$i18n.t('message.activity_program_import'),
          type: 'text',
        }
      ];
    },
    onToolboxSave() {
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .rounded1 {
    border-radius: 25px;
    border: 2px solid #73AD21;
    padding: 20px;
    width: 100px;
  }
</style>
