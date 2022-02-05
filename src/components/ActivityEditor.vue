<template>
  <div>
    <v-app id="inspire">
      <sidebar></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()"></v-app-bar-nav-icon>
        <v-app-bar-title v-if="!saved">{{ $t("message.activity_new") }} {{prefix}} {{activity.name}}</v-app-bar-title>
        <v-app-bar-title v-else>{{ $t("message.activity_modify") }} {{prefix}} {{activity.name}}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="save()">
          <v-icon>save</v-icon>
          {{ $t("message.save") }}
        </v-btn>
        <v-tabs slot="extension" v-model="tab" centered slider-color="white">
          <v-tab v-for="item in tabs" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <v-main>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-flex xs12 md6 offset-md3>
                  <p style="text-align: left">
                    <v-alert :value="true" type="info" style="font-size:16px">
                      {{ $t("message.activity_tip_1") }}
                    </v-alert>
                  </p>
                  <h3 class="text-xs-left">{{ $t("message.activity_data") }} </h3>
                  <v-card>
                    <v-form class="cardContent">
                      <v-text-field v-model="activity.name" label="Nome" required></v-text-field>
                      <v-text-field v-model="activity.description" v-bind:label="$t('message.activity_description')">
                      </v-text-field>
                      <v-select v-model="defaultView" :items="viste"
                        v-bind:label="$t('message.activity_predefined_view')" required></v-select>
                    </v-form>
                  </v-card>
                  <br><br>
                  <h3 class="text-xs-left">{{ $t("message.activity_typography") }} </h3>
                  <v-card>
                    <div class="cardContent">
                      <!--
											<v-select :items="fontSizeLabels" v-model="activity.fontSize" label="Grandezza testo"></v-select>
										-->
                      <v-switch v-bind:label="$t('message.activity_caps_only')" v-model="activity.capsSwitch">
                      </v-switch>
                      <!--
											<v-layout row wrap>
												<v-flex>
													<v-switch :label="`Modalità Daltonici`" v-model="daltonicSwitch"></v-switch>
												</v-flex>
												<v-flex>
													<v-select v-if="daltonicSwitch" v-model="daltonic" :items="daltonicModes" label="Tipo daltonismo" required></v-select>
												</v-flex>
											</v-layout>
										-->
                    </div>
                  </v-card>
                  <br><br>
                  <h3 class="text-xs-left">{{ $t("message.activity_typography_font_ui") }} </h3>
                  <v-card>
                    <div class="cardContent">
                      <span v-bind:style="bodyUIstyleObj">Lorem ipsum dolor sit amet</span>
                      <v-radio-group v-model="activity.bodyFont" column>
                        <v-radio label="Roboto" value="Roboto"></v-radio>
                        <v-radio label="Open Sans" value="opensans"></v-radio>
                        <!--
												<v-radio label="Test Me (Altà leggibilità, indicato per dislessia)" value="testme"></v-radio>
												<v-radio label="Open-Dyslexic (Altà leggibilità, indicato per dislessia)" value="open-dys"></v-radio>
											-->
                      </v-radio-group>
                    </div>
                  </v-card>
                  <br><br>
                  <h3 class="text-xs-left">{{ $t("message.activity_typography_font_editor") }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <span v-bind:style="codeUIstyleObj">function life() { return 42; }</span>
                      <v-radio-group v-model="activity.codeFont" column>
                        <v-radio label="Ubuntu Mono" value="ubuntumono"></v-radio>
                        <v-radio label="Roboto Mono" value="robotomono"></v-radio>
                      </v-radio-group>
                    </div>
                  </v-card>
                  <br><br>
                  <!--
									<h3 class="text-xs-left">Lingua</h3>
									<v-card>
										<div class="cardContent">
											<v-select v-model="uiLang" :items="langs" label="Lingua Interfaccia" required></v-select>
											<v-select v-model="blocklyLang" :items="langs" label="Lingua Blocchi" required></v-select>
										</div>
									</v-card>
									<br><br>
								-->
                  <h3 class="text-xs-left">{{ $t("message.activity_programing_title") }}</h3>
                  <v-card>
                    <div class="cardContent">
                      <v-layout row wrap>
                        <!--
												<v-flex>
													<v-checkbox v-model="activity.availableViews" label="Programmazione a Blocchi" value="blockly"></v-checkbox>
												</v-flex>
												<v-flex>
													<v-checkbox v-model="activity.availableViews" label="Editor Python" value="python"></v-checkbox>
												</v-flex>
												<v-flex>
													<v-checkbox v-model="activity.availableViews" label="Visuale di Esecuzione" value="runtime"></v-checkbox>
												</v-flex>
												<v-flex>
  												<v-switch v-model="activity.viewSource" label="Permetti di visualizzare il codice generato"></v-switch>
												</v-flex>
                        -->
                        <v-flex>
                          <v-checkbox v-model="activity.autoRecVideo"
                            v-bind:label="$t('message.activity_auto_rec_video')"></v-checkbox>
                        </v-flex>
                        <v-flex>
                          <v-text-field v-model="activity.maxBlocks"
                            v-bind:label="$t('message.activity_blocks_max_blocks')"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-card>
                  <!--
									<h3 class="text-xs-left">Funzionalità sperimentali</h3>
									<v-card>
										<div class="cardContent">
											<v-switch color="orange darken-3" :label="`Abilità funzionalità sperimentali`" v-model="experimental"></v-switch>
											<v-layout row wrap>
												<v-flex>
													<v-switch v-if="experimental" :label="`Cronologia Modifiche`" v-model="editHistory"></v-switch>
												</v-flex>
												<v-flex>
													<v-switch v-if="editHistory" :label="`Permetti navigazione nella cronologia modifiche`" v-model="navHistory"></v-switch>
												</v-flex>
											</v-layout>
											<v-switch v-if="experimental" :label="`Esecuzione passo passo`" v-model="stepbystep"></v-switch>
											<v-switch disabled v-if="experimental" :label="`Realtà Aumentata`" v-model="ar"></v-switch>
										</div>
									</v-card>
								-->
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-flex xs12 md8 offset-md2>
                <v-flex>
                  <h3> {{ $t("message.activity_toolbar_preview") }} </h3>
                  <v-app-bar>
                    <v-app-bar-nav-icon v-if="activity.drawerEnabled"></v-app-bar-nav-icon>
                    <v-app-bar-title v-if="activity.showName">{{ activity.name || $t("message.activity_name")}}
                    </v-app-bar-title>
                    <v-spacer></v-spacer>
                    <template v-for="button in activity.buttons">
                      <v-btn style="height: 70%" :color="button.colorBtn" :class="button.colorText">
                        {{ button.label }}
                        <v-icon right dark>{{ button.icon }}</v-icon>
                      </v-btn>
                      &nbsp;&nbsp;
                    </template>
                  </v-app-bar>
                  <br>
                  <v-switch v-bind:label="$t('message.activity_lateral_menu_icon')" v-model="activity.drawerEnabled">
                  </v-switch>
                  <v-switch v-bind:label="$t('message.activity_name')" v-model="activity.showName"></v-switch>
                  <br>
                  <h3> {{ $t("message.activity_toolbar_buttons") }} </h3>
                  <v-btn @click="addButton()" outlined color="green">
                    <v-icon>add</v-icon> {{ $t("message.activity_toolbar_buttons_add") }}
                  </v-btn>
                  <v-btn @click="restoreDefaults()" outlined color="blue">
                    <v-icon>undo</v-icon> {{ $t("message.activity_toolbar_buttons_predefined") }}
                  </v-btn>
                  <v-btn @click="removeAll()" outlined color="red">
                    <v-icon>clear</v-icon> {{ $t("message.activity_toolbar_buttons_remove_all") }}
                  </v-btn>
                  <br><br>
                  <div v-for="button, i in activity.buttons" :key="button.id">
                    <h3>Pulsante {{i + 1}}
                      <v-btn @click="removeButton(i)" text icon v-if="!button.notErasable">
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </h3>
                    <v-card>
                      <div class="cardContent">
                        <span class="grey--text text--darken-2" v-if="button.notErasable">
                          {{ $t("message.activity_toolbar_buttons_cannot_remove_run") }} </span>
                        <v-text-field v-model="button.label" v-bind:label="$t('message.activity_label')"></v-text-field>
                        <v-select v-model="button.action" :items="actions" v-bind:label="$t('message.activity_action')"
                          :disabled="button.notErasable">
                        </v-select>
                        <v-select :items="textColors" v-model="button.colorText"
                          v-bind:label="$t('message.activity_text_color')"></v-select>
                        <v-layout row wrap>
                          <v-flex xs4 style="text-align: left">
                            <span style="vertical-align: 55%"> {{ $t("message.activity_toolbar_buttons_color") }}
                              &nbsp;&nbsp;</span>
                            <div style="display:inline-block">
                              <swatches popover-to="left" v-model="button.colorBtn"></swatches>
                            </div>
                          </v-flex>
                          <v-flex xs4 style="text-align: left">
                            {{ $t("message.activity_toolbar_buttons_icon") }} <v-btn style="margin:0" large text
                              @click="b=i; iconPicker=true;" color="black">
                              <v-icon large color="black">{{ button.icon }}</v-icon>
                            </v-btn>
                          </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <br>
                        <v-btn :color="button.colorBtn" :class="button.colorText">
                          {{ button.label }}
                          <v-icon right dark>{{ button.icon }}</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                    <br>
                  </div>
                </v-flex>
              </v-flex>
            </v-container>
            <v-dialog v-model="iconPicker" max-width="600px">
              <v-card>
                <v-card-title class="headline">{{ $t("message.activity_toolbar_buttons_icon_select") }}</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-layout row wrap>
                      <template v-for="icon, i in iconList">
                        <v-flex xs1 :key="icon.id">
                          <v-icon large @click="activity.buttons[b].icon=icon; iconPicker = false">{{ icon }}</v-icon>
                        </v-flex>
                        <template v-if="i%10==0">
                          <br :key="i">
                        </template>
                      </template>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-tab-item>
          <!--
					<v-tab-item>
						<wsFactory />
					</v-tab-item>
				-->
          <v-tab-item>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <!-- Column A -->
                <v-flex xs12 md6 offset-md3>
                  <h3 class="text-xs-left">{{ $t("message.activity_views_title") }}</h3>
                  <v-card>
                    <v-form class="cardContent">
                      <v-switch v-bind:label='$t("message.activity_views_runtime_camera")'
                        v-model="activity.exec.camera"></v-switch>
                      <v-switch v-bind:label='$t("message.activity_views_runtime_log")' v-model="activity.exec.log">
                      </v-switch>
                    </v-form>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <wsFactory />
          </v-tab-item>
        </v-tabs-items>
      </v-main>
    </v-app>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>
<script>
import Swatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';

// import wsFactory from '../components/wsFactory';
import sidebar from '../components/Sidebar';

export default {
  name: 'ActivityEditor',
  components: {
    Swatches,
    sidebar /* , wsFactory */
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
      CB: process.env.CB_ENDPOINT + process.env.APIv2,
      snackbar: false,
      iconPicker: false,
      iconList: ['play_arrow',
        'pause',
        'stop',
        'save',
        'autorenew',
        'build',
        'check_circle',
        'camera',
        'code',
        'help',
        'done',
        'eject',
        'extension',
        'face',
        'favorite',
        'help',
        'home',
        'hourglass_empty',
        'info',
        'language',
        'query_builder',
        'question_answer',
        'search',
        'settings',
        'stars',
        'games',
        'loop',
        'replay',
        'volume_down',
        'volume_mute',
        'volume_off',
        'volume_up',
        'clear',
        'block',
        'add'
      ],
      snackbarText: '',
      b: 0,
      activity: {
        exec: {
          camera: true,
          log: true,
        },
        name: null,
        drawerEnabled: true,
        showName: true,
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
      },
      colors: ['red', 'pink', 'purple', 'yellow', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal',
        'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'black',
        'grey', 'black', 'white'
      ],
      textColors: [
        {
          text: 'Bianco',
          value: 'white--text',
        },
        {
          text: 'Nero',
          value: 'black--text',
        },
      ],
      actions: [
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
        'Piccolo',
        'Medio',
        'Grande',
        'Molto grande',
      ],

      daltonicSwitch: 0,
      daltonicType: 1,
      daltonicModes: [
        'Deuteranomaly',
        'Protanomaly',
        'Protanopia',
      ],
      langs: [
        this.$i18n.t('message.activity_lang_italian'),
        this.$i18n.t('message.activity_lang_english'),
        this.$i18n.t('message.activity_lang_french'),
      ],
      uiLang: 'Italiano',
      blocklyLang: 'Inglese',
      editHistory: false,
      navHistory: false,
      experimental: true,
      stepbystep: false,
      tab: null,
      tabs: [
        this.$i18n.t('message.activity_tabs_general'),
        this.$i18n.t('message.activity_tabs_toolbar'),
        this.$i18n.t('message.activity_tabs_runtime')
      ],
      ar: false,
      // drawer: null,
      source: null,
      msg: 'Welcome to Your Vue.js App',
      defaultView: 'blocks',
      viste: [
        {
          text: this.$i18n.t('message.activity_views_blocks'),
          value: 'blocks'
        },
        {
          text: this.$i18n.t('message.activity_views_runtime'),
          value: 'exec',
          disabled: true
        },
        {
          text: this.$i18n.t('message.activity_views_python'),
          value: 'python',
          disabled: true
        },
      ],
    };
  },
  mounted() {
    if (this.$route.params.name) {
      const axios = this.$axios;
      const {
        CB
      } = this;
      console.log('Loading activity', this.$route.params.name);
      this.saved = true;
      axios.get(`${CB}/loadActivity`, {
        params: {
          name: this.$route.params.name,
        },
      }).then((response) => {
        this.activity = response.data;
      });
    } else {
      this.restoreDefaults();
    }
  },
  methods: {
    save() {
      if (this.activity.name) {
        const axios = this.$axios;
        const {
          CB
        } = this;
        axios.post(`${CB}/saveActivity`, {
          activity: this.activity,
        }).then(() => {
          this.snackbarText = this.$i18n.t('activity_saved');
          this.snackbar = true;
          this.saved = true;
        });
      } else {
        this.snackbarText = this.$i18n.t('activity_save_error');
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
          label: this.$i18n.t('message.activity_program_run'),
          icon: 'play_arrow',
          colorBtn: 'green',
          colorText: 'white--text',
          action: 'runProgram',
          notErasable: true,
        },
        {
          label: this.$i18n.t('message.activity_program_save'),
          icon: 'save',
          colorBtn: 'blue',
          colorText: 'white--text',
          action: 'saveProgram',
        },
      ];
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

  .cardContent {
    padding: 16px;
  }
</style>
