<template>
  <!-- Use computed CSS rules -->
  <div :style="cssProps">
    <v-app id="inspire">
      <!-- the mobile draw animation doesn't play well with how Blockly is draw -->
      <sidebar mobileDrawAnim=0></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()" v-if="activity.drawerEnabled"></v-app-bar-nav-icon>
        <v-app-bar-title v-if="activity.showName">
          {{ activity.name }}
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-chip class="ma-2" v-if="activity.maxBlocks > 0" label>{{ $t("message.activity_program_remaining_blocks") }}: {{ workspace.remainingCapacity() }}</v-chip>
        <!-- If the API is available, show the desired buttons -->
        <template v-if="status == 200">
          <template v-for="button in activity.buttons">
            <template v-if="button.type == 'text'">
              <v-btn @click="_self[button.action]()" text>
                <v-icon>{{ button.icon }}</v-icon>
                {{ button.label }}
              </v-btn>
            </template>
            <template v-else>
              <v-btn @click="_self[button.action]()" style="height: 70%" :color="button.colorBtn"
                :class="button.colorText">
                {{ button.label }}
                <v-icon right dark>{{ button.icon }}</v-icon>
              </v-btn>
            </template>
            &nbsp;&nbsp;
          </template>
        </template>
        <!-- If the API is not responding, show an error icon -->
        <v-btn @click="dialog = true" icon v-if="status != 200">
          <v-icon>error</v-icon>
        </v-btn>
      </v-app-bar>
      <!-- Page content -->
      <v-main>
        <!-- Blockly -->
        <div style="height: 480px; width: 600px;">
          <div ref="blocklyTotal" style="height: 100%; width: 100%;" class="blocklyTotal">
            <div ref="blocklyArea" style="height: 100%; width: 100%;" class="blocklyArea">
              <div ref="blocklyDiv" style="height: 100%; width: 100%;" class="blocklyDiv">
              </div>
            </div>
          </div>
        </div>
      </v-main>
      <!-- Hidden file input. Its file dialog it's event-click triggered by the "pickFile" method -->
      <input type="file" style="display: none" ref="file" @change="importProgram">
      <!-- When the selection is completed, the result is then handled by importProgram -->
      <!--   Dialogs   -->
      <!-- Runtime -->
      <v-dialog v-model="runtimeDialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ $t("message.program_status_title") }}
            <v-spacer></v-spacer>
            <v-chip v-if="program_status"
              class="ma-2"
              color="red"
              text-color="white"
            >
              {{ $t("message.program_running")}}
            </v-chip>
            <v-chip v-else
              class="ma-2"
              color="grey"
              text-color="white"
            >
              {{ $t("message.program_completed")}}
            </v-chip>
          </v-card-title>
          <template v-if="activity.exec.camera">
            <v-card-text v-if="runtimeDialog">
              <v-img v-if="runtimeDialog" :src="webcamStream" />
            </v-card-text>
          </template>
          <v-divider></v-divider>
          <template v-if="activity.exec.log">
            {{ log }}
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="runtimeDialog = false; stopProgram()">
              <span v-if="program_status">{{ $t("message.program_stop") }}</span>
              <span v-else>{{ $t("message.close") }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Load Program -->
      <v-dialog v-model="carica" max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ $t("message.program_list") }}
          </v-card-title>
          <v-list>
            <v-list-item v-for="program in programList" :key="program.el" @click="{}">
              <v-list-item-title ripple @click="loadProgram(program.name)">
                {{ program.name }}
              </v-list-item-title>
              <v-btn v-if="program.default != 'True'" text icon color="grey darken-1" ripple
                @click="deleteProgramDlg(program.name)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="carica = false">
              {{ $t("message.cancel") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Save Program -->
      <v-dialog v-model="salva" max-width="430">
        <v-card>
          <v-card-title class="headline">
            {{ $t("message.save_as") }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-text-field v-model="newProgramName" v-bind:label="$t('message.save_as')" v-if="salva" onClick="this.select()"
                v-on:keyup.enter="saveProgramAs(), salva = false" v-on:keyup.esc="salva = false" autofocus>
              </v-text-field>
            </v-card-text>
            <v-btn color="red darken-1" text="text" @click="salva = false">
              {{ $t("message.cancel") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="saveProgramAs(), salva = false">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Name error -->
      <v-dialog v-model="unvalidName" max-width="290">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
            {{ $t("message.program_name_must_be_filled") }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text="text" @click="unvalidName = false, salva = true">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Overwrite error -->
      <v-dialog v-model="CannotOverwrite" max-width="290">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
            {{ $t("message.cannot_overwrite_default_program") }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text="text" @click="CannotOverwrite = false, salva = true">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Ask for overwrite -->
      <v-dialog v-model="overwriteDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ $t("message.overwrite") }}
          </v-card-title>
          <v-card-actions>
            <v-card-text>
              {{ $t('message.program_exists_overwrite', { programName: programName }) }}
            </v-card-text>
            <v-btn color="red darken-1" text="text" @click="overwriteDialog = false, salva = true">
              {{ $t("message.no") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="overwrite = 1, overwriteDialog = false, saveProgram()">
              {{ $t("message.yes") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Clear Program -->
      <v-dialog v-model="clear" max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ $t("message.delete") }}
          </v-card-title>
          <v-card-actions>
            <v-card-text>
              {{ $t('message.clear_sure') }}
            </v-card-text>
            <v-btn color="red darken-1" text="text" @click="clear = false">
              {{ $t("message.no") }}
            </v-btn>
            <v-btn color="green darken-1" text="text"
              @click="del = false, carica = false, clearProgram()">
              {{ $t("message.yes") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Delete Program -->
      <v-dialog v-model="del" max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ $t("message.delete") }}
          </v-card-title>
          <v-card-actions>
            <v-card-text>
              {{ $t('message.delete_sure', { programName: programName }) }}
            </v-card-text>
            <v-btn color="red darken-1" text="text" @click="del = false">
              {{ $t("message.no") }}
            </v-btn>
            <v-btn color="green darken-1" text="text"
              @click="del = false, carica = false, deleteProgram(newProgramName)">
              {{ $t("message.yes") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Show Code -->
      <v-dialog v-model="dialogCode">
        <v-card>
          <v-card-title class="headline">Codice</v-card-title>
          <v-card-text class="text-xs-left">
            <prism language="python">{{ code }} </prism>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="dialogCode = false">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Status -->
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ $t("message.coderbot_status") }}</v-card-title>
          <v-card-text>
            {{ statusText }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="dialog = false">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Generic dialog -->
      <v-dialog v-model="generalDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ generalDialogTitle }}</v-card-title>
          <v-card-text>
            {{ generalDialogText }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text="text" @click="generalDialog = false">
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
      <!-- Notification Snackbar -->
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="pink" text @click="snackbar = false">
          {{ $t("message.close") }}
        </v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>
<script>
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/python';
import * as blockly_it from 'blockly/msg/it';
import * as blockly_en from 'blockly/msg/en';
import * as blockly_fr from 'blockly/msg/fr';

import '../assets/js/blockly/blocks';
import * as bot_it from '../assets/js/blockly/bot_it.json';
import * as bot_en from '../assets/js/blockly/bot_en.json';
import * as bot_fr from '../assets/js/blockly/bot_fr.json';

import i18n from '../i18n/index';

import 'prismjs';
import 'prismjs/components/prism-python.js';
import sidebar from '../components/Sidebar';

const locale = i18n.locale.substring(0, 2);

const coderbot_locales = {
  it: bot_it.default,
  en: bot_en.default,
  fr: bot_fr.default
};

Blockly.Msg = { ...Blockly.Msg, ...coderbot_locales[locale] };

const blockly_locales = {
  it: blockly_it,
  en: blockly_en,
  fr: blockly_fr
};
Blockly.setLocale(blockly_locales[locale]);

Blockly.Blocks.CoderBotSettings.instrumentlist = [];
Blockly.Blocks.CoderBotSettings.animalist = [];

export default {
  name: 'Activity',
  components: {
    sidebar,
    Prism: () => import('vue-prism-component'),
  },
  data: () => ({
    cssProps: {
      '--bodyFont': 'Roboto',
      '--codeFont': 'Ubuntu Mono',
    },
    activityStyle: null,
    activity: {
      exec: {},
    },
    log: null,
    settings: null,
    snackText: null,
    snackbar: false,
    drawer: false,
    tabs: null,
    dialog: false,
    dialogCode: false,
    CB: process.env.CB_ENDPOINT + process.env.APIv2,
    CBv1: process.env.CB_ENDPOINT,
    status: null,
    info: null,
    code: '',
    workspace: null,
    generalDialog: false,
    generalDialogText: null,
    generalDialogTitle: null,
    experimental: 0,
    execMode: 'fullExec', // can be 'fullExec' or 'stepByStep',
    carica: false,
    programList: '',
    salva: false,
    programName: '',
    newProgramName: '',
    unvalidName: false,
    del: false,
    clear: false,
    webcamStream: `${process.env.CB_ENDPOINT + process.env.APIv1}/video/stream`,
    runtimeDialog: false,
    isDefault: '',
    CannotOverwrite: false,
    defaultProgramName: '',
    overwrite: 0,
    overwriteDialog: false,
    dirty: false,
    confirm_exit_dialog: null,
    router_next: null,
    program_status: null
  }),
  computed: {
    statusText() {
      if (this.status) {
        return this.$i18n.t('message.coderbot_status_online');
      }
      return this.$i18n.t('message.coderbot_status_offline');
    },
  },
  mounted() {
    this.loadMusicPackages();

    // Get the activity
    const axios = this.$axios;
    const {
      CB
    } = this;
    if (this.$route.path == '/program') {
      console.log('Loading the default activity');
      this.activity = {
        bodyFont: 'Roboto',
        buttons: [
          {
            action: 'clearProgramDlg',
            icon: 'clear',
            label: this.$i18n.t('message.activity_program_clear'),
            type: 'text',
          },
          {
            action: 'saveProgram',
            icon: 'save',
            label: this.$i18n.t('message.activity_program_save'),
            type: 'text',
          },
          {
            action: 'toggleSaveAs',
            icon: 'edit',
            label: this.$i18n.t('message.activity_program_save_as'),
            type: 'text',
          },
          {
            action: 'loadProgramList',
            icon: 'folder_open',
            label: this.$i18n.t('message.activity_program_load'),
            type: 'text',
          },
          {
            action: 'runProgram',
            icon: 'play_arrow',
            label: this.$i18n.t('message.activity_program_run'),
            type: 'text',
          },
          {
            action: 'getProgramCode',
            icon: 'code',
            label: this.$i18n.t('message.activity_program_show_code'),
            type: 'text',
          },
          {
            action: 'exportProgram',
            icon: 'fa-file-export',
            label: this.$i18n.t('message.activity_program_export'),
            type: 'text',
          },
          {
            action: 'pickFile',
            icon: 'fa-file-import',
            label: this.$i18n.t('message.activity_program_import'),
            type: 'text',
          },

        ],
        capsSwitch: false,
        codeFont: 'ubuntumono',
        description: null,
        drawerEnabled: true,
        exec: {
          camera: true,
          log: true,
        },
        fontSize: 'Medio',
        name: this.$i18n.t('message.activity_program_title'),
        showName: true,
      };
    } else {
      console.log('Loading activity', this.$route.params.name);
      this.saved = true;
      axios.get(`${CB}/loadActivity`, {
        params: {
          name: this.$route.params.name,
        },
      }).then((response) => {
        console.log('Activity loaded', response.data);
        this.activity = response.data;
        this.updateCssProps();
      });
    }

    this.status = null;
    this.pollStatus();

    // Start the polling
    setInterval(() => {
      this.pollStatus();
    }, 1000);

    // Get the legacy configuration and initialize Blockly
    axios.get(`${this.CBv1}/config`)
      .then((response) => {
        const settings = response.data;
        this.settings = settings;
        this.initBlockly(settings);
      });
  },
  beforeRouteLeave(to, from, next) {
    if (this.workspace.dirty) {
      this.router_next = next;
      this.confirm_exit_dialog = true;
    } else {
      next();
    }
  },
  methods: {
    updateCssProps() {
      // (Re)Compute the CSS variables from the activity definition, then update them
      console.log('Computing CSS Props');
      const {
        bodyFont
      } = this.activity;
      let fontFamilyBody = '';
      if (bodyFont == 'opensans') {
        fontFamilyBody = 'Open Sans';
      } else if (bodyFont == 'roboto') {
        fontFamilyBody = 'Roboto';
      }
      const {
        codeFont
      } = this.activity;
      let fontFamilyCode = '';
      if (codeFont == 'ubuntumono') {
        fontFamilyCode = 'Ubuntu Mono';
      } else if (codeFont == 'robotomono') {
        fontFamilyCode = 'Roboto Mono';
      }
      let textTransform = '';
      if (this.activity.capsSwitch) {
        textTransform = 'uppercase';
      } else {
        textTransform = 'none';
      }

      this.cssProps = {
        '--bodyFont': fontFamilyBody,
        '--codeFont': fontFamilyCode,
        '--transform': textTransform,
      };
      console.log('Computed CSS props:', this.cssProps);
    },

    initBlockly(settings) {
      // Extend the default blocks set
      this.blocksExtensions(settings);

      const toolboxLevel = settings.prog_level;
      const toolbox = require(`../assets/toolbox_${toolboxLevel}.xml`);

      // Clean the base64 encoding of the resource, removing meta infos
      const b64Toolbox = toolbox.substring(toolbox.indexOf(',') + 1).toString();

      // Decode it and get the clean serialized XML as plain string
      const serializedToolbox = this.$base64.decode(b64Toolbox);

      // Initialise Blockly Instance
      // Blockly.Generator.prototype.INDENT = '    ';
      this.workspace = Blockly.inject(
        // Blockly container
        this.$refs.blocklyDiv,
        // Options
        {
          toolbox: serializedToolbox,
          // path: 'static/js/blockly/',
          // TODO: Use values from fetched configuration!
          scrollbars: true,
          maxBlocks: this.activity.maxBlocks,
          zoom: {
            controls: true,
            wheel: false,
            startScale: 1.0,
            maxScale: 1.5,
            minScale: 0.2,
          },
        },
      );
      const {
        workspace
      } = this;
      workspace.dirty = false;
      workspace.addChangeListener(() => {
        workspace.dirty = true;
      });

      // Pass the reference to the method to call, don't execute it (`()`)
      // window.addEventListener('resize', this.resizeWorkspace, false);

      // Initial resize
      // this.resizeWorkspace()
      // Blockly.svgResize(this.workspace);
    },
    blocksExtensions() {
      const {
        settings
      } = this;

      // coderbot.cfg data (temp workaround, must be fetched from backend)

      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED = settings.move_fw_speed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE = settings.move_fw_elapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED = settings.move_tr_speed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE = settings.move_tr_elapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION = false; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU = false; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_ENCODER_AVAILABLE = true; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_LEVEL = settings.prog_level;

      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_SCROLLBARS = true; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MAXBLOCKS = -1;
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_SAVEONRUN = true; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_FW_SPEED = settings.ctrl_fw_speed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_FW_ELAPSE = settings.ctrl_fw_elapse;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_TR_SPEED = settings.ctrl_tr_speed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_TR_ELAPSE = settings.ctrl_tr_elapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_COUNTER = true; // to check, never used
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_MOVE_MOTION = false; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_MOVE_MPU = false; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_CNN_MODEL_LIST = [
        ['generic_fast_low', 'generic_fast_low'],
        ['generic_slow_high', 'generic_slow_high'],
        ['generic_object_detect', 'generic_object_detect']
      ];
    },

    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },

    getProgramData() {
      // Build the program object
      const name = this.programName;
      const {
        workspace
      } = this;
      const xml_code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      const dom_code = Blockly.Xml.domToText(xml_code);
      const {
        isDefault
      } = this;

      window.LoopTrap = 1000;
      Blockly.Python.INFINITE_LOOP_TRAP = 'get_prog_eng().check_end()\n';
      const code = Blockly.Python.workspaceToCode(workspace);
      Blockly.Python.INFINITE_LOOP_TRAP = null;

      return {
        name,
        dom_code,
        code,
        default: isDefault,
      };
    },

    loadMusicPackages() {
      this.$axios.get(`${this.CB}/listMusicPackages`).then((result) => {
        this.packagesInstalled = [];
        const music_packages = JSON.parse(result.data);
        Object.entries(music_packages).forEach((key) => {
          const package_key = key[0];
          const music_package = key[1];
          const names = [music_package.name_IT, package_key];
          if (music_package.category == 'instrument') {
            this.packagesInstalled.push([names, 'instrument']);
          } else if (music_package.category == 'animal') {
            this.packagesInstalled.push([names, 'animal']);
          }
        });
      });
    },

    exportProgram() {
      // Create a blob object and simulate a click event starting the download
      const data = JSON.stringify(this.getProgramData());
      const blob = new Blob([data], {
        type: 'text/json'
      });
      const e = document.createEvent('MouseEvents');
      const a = document.createElement('a');
      a.download = `${this.programName}.json` || 'noname.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    pickFile() {
      // Manually trigger the file dialog for the hidden file input form
      this.$refs.file.click();
    },

    importProgram(e) {
      // Once the file is selected, read it and populate the Blockly
      //  workspace with the contained program
      const {
        workspace
      } = this;
      const {
        files
      } = e.target;
      if (files[0] !== undefined) {
        const fileName = files[0].name;
        if (fileName.lastIndexOf('.') <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsText(files[0]);
        fr.addEventListener('load', () => {
          const importedProgram = JSON.parse(fr.result);
          const xml = Blockly.Xml.textToDom(importedProgram.dom_code);
          Blockly.Xml.domToWorkspace(xml, workspace);
        });
      } else {
        console.log('Something went wrong importing');
      }
    },

    toggleSaveAs() {
      this.salva = true;
      this.newProgramName = this.programName;
    },

    saveProgramAs() {
      if (this.newProgramName != '') {
        if (this.isDefault == 'True' && this.programName == this.newProgramName) {
          this.CannotOverwrite = true;
          console.log('error');
        } else {
          this.defaultProgramName = this.programName;
          this.programName = this.newProgramName;
          this.newProgramName = '';
          this.saveProgram();
        }
      } else {
        this.unvalidName = true;
      }
    },

    saveProgram() {
      if (this.programName != '') {
        const axios = this.$axios;
        const {
          CB
        } = this;
        const {
          overwrite
        } = this.$data;
        console.log('save');
        console.log(overwrite);
        const data = this.getProgramData();
        axios.post(`${CB}/saveProgram?overwrite=${overwrite}`, {
          name: data.name,
          dom_code: data.dom_code,
          code: data.code,
          default: '',
        }).then((prog_data) => {
          if (prog_data.data == 'defaultOverwrite' || prog_data.data == 'askOverwrite') {
            if (prog_data.data == 'askOverwrite') {
              this.$data.overwriteDialog = true;
            } else {
              this.$data.programName = this.$data.defaultProgramName;
              this.$data.defaultProgramName = '';
              this.$data.CannotOverwrite = true;
            }
          } else {
            this.$data.isDefault = '';
            this.$data.overwrite = 0;
            console.log('salvato');
            this.workspace.dirty = false;
          }
        });
      } else {
        this.unvalidName = true;
      }
    },

    loadProgramList() {
      // Get the list of available programs and populate the popup
      const axios = this.$axios;
      const {
        CB
      } = this.$data;
      axios.get(`${CB}/list`)
        .then((response) => {
          this.$data.carica = true;
          this.$data.programList = response.data;
        });
    },

    loadProgram(program) {
      const axios = this.$axios;
      const {
        CB
      } = this.$data;
      const {
        workspace
      } = this.$data;
      this.$data.carica = false;
      this.$data.programName = program;
      axios.get(`${CB}/load`, {
        params: {
          name: program,
        },
      }).then((data) => {
        workspace.clear();
        const xml = Blockly.Xml.textToDom(data.data.dom_code);
        Blockly.Xml.domToWorkspace(xml, workspace);
        this.$data.isDefault = data.data.default;
      });
    },

    clearProgramDlg() {
      this.$data.clear = true;
    },

    clearProgram() {
      this.$data.programName = '';
      this.$data.code = '';
      this.$data.workspace.clear();
      this.$data.clear = false;
    },

    deleteProgramDlg(program) {
      this.$data.newProgramName = program;
      this.$data.del = true;
    },

    deleteProgram(program) {
      console.log(program);
      if (this.$data.programName == program) {
        this.$data.programName = '';
        this.$data.code = '';
        this.$data.workspace.clear();
      }
      const axios = this.$axios;
      const {
        CB
      } = this.$data;
      console.log('delete');
      axios.post(`${CB}/delete`, {
        name: program,
      }).then(() => {
        console.log('deleted');
      });
    },

    pollStatus() {
      const axios = this.$axios;
      const {
        CB
      } = this;
      axios.get(`${CB}/status`)
        .then((response) => {
          // If the reconnection happened while in this component, send a notification
          if (this.status == 0 && response.status) {
            this.snackText = this.$i18n.t('message.coderbot_status_online');
            this.snackbar = true;
          }
          this.statusData = response.data;
          this.status = response.status;
        });
      axios.get(`${this.CB}/info`)
        .then((response) => {
          this.info = response.data;
        })
        .catch((error) => {
          console.log(`pollStatus error: ${error}`);
          // If the disconnection happened while in this component, send a notification
          if (this.status) {
            this.snackText = this.$i18n.t('coderbot_offline_2');
            this.snackbar = true;
          }
          this.status = 0;
        });
    },

    resizeWorkspace() {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      let element = this.$refs.blocklyArea;
      do {
        element = element.offsetParent;
      } while (element);

      const {
        offsetWidth
      } = this.$refs.blocklyArea;
      this.$refs.blocklyDiv.style.width = `${offsetWidth}px`;
      const {
        offsetHeight
      } = this.$refs.blocklyArea;
      this.$refs.blocklyDiv.style.height = `${offsetHeight}px`;
    },

    getProgramCode() {
      // Expose the program, as generated by Blockly
      if (this.experimental) {
        this.experimental = false;
        this.blocksExtensions();
        this.experimental = true;
      }

      Blockly.Python.STATEMENT_PREFIX = null;
      Blockly.Python.addReservedWords();
      Blockly.Python.INFINITE_LOOP_TRAP = null;
      this.code = Blockly.Python.workspaceToCode(this.workspace);
      this.dialogCode = true;

      if (this.experimental) {
        this.blocksExtensions();
      }
    },

    runProgramExperimental() {
      if (this.status) {
        const axios = this.$axios;
        const {
          CB
        } = this;
        const xml_code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        const dom_code = Blockly.Xml.domToText(xml_code);
        Blockly.Python.INFINITE_LOOP_TRAP = null;
        // Injecting custom code
        Blockly.Python.STATEMENT_PREFIX = 'if not is_execFull:\n data_coderbotStatus["prog_gen"]["status"] = "pause"\n saveStatus()\n signal.pause()\ndata_coderbotStatus["prog_gen"]["currentBlockId"] = str(%1)\nsaveStatus()\n';
        Blockly.Python.addReservedWords('#highlightBlock');
        const code_modified = Blockly.Python.workspaceToCode();

        axios.post(`${CB}/exec2`, {
          name: 'Hello, World',
          dom_code,
          code: code_modified,
          mode: this.execMode,
        });
      }
    },
    runProgram() {
      if (this.status) {
        const axios = this.$axios;
        const {
          CB
        } = this;
        // POST /program/save
        const options = this.activity;
        const xml_code = Blockly.Xml.workspaceToDom(this.workspace);
        const dom_code = Blockly.Xml.domToText(xml_code);
        window.LoopTrap = 1000;
        Blockly.Python.INFINITE_LOOP_TRAP = 'get_prog_eng().check_end()\n';
        const code = Blockly.Python.workspaceToCode(this.workspace);
        Blockly.Python.INFINITE_LOOP_TRAP = null;

        axios.post(`${CB}/exec`, {
          name: 'run program',
          dom_code,
          code,
          options,
        }).then(() => {
          this.runtimeDialog = true;
          setTimeout(() => {
            this.updateExecStatus();
          }, 1000);
        });
      } else {
        this.generalDialog = true;
        this.generalDialogTitle = this.$i18n.t('error');
        this.generalDialogText = this.$i18n.t('coderbot_offline_3');
      }
    },
    stopProgram() {
      console.log('Stopping');
      const axios = this.$axios;
      axios.post(`${this.CBv1}/program/end`);
    },
    updateExecStatus() {
      const axios = this.$axios;
      console.log('Updating Execution status');
      axios.get(`${this.CBv1}/program/status`)
        .then((response) => {
          this.program_status = response.data.running;
          if (this.program_status) {
            // Check again in a second
            setTimeout(() => {
              this.updateExecStatus();
            }, 1000);
            this.log = response.data.log;
          } else {
            this.log = 'Esecuzione conclusa';
          }
        });
    },

  },

};
</script>
<style scoped>
.application {
	font-family: var(--bodyFont);
	text-transform: var(--transform);
}

pre,
code {
	font-family: var(--codeFont);
}

.blocklyDiv {
	position: absolute;
}

.blocklyArea {
	height: 97%;
	width: 100%;
}

.blocklyTotal {
	line-height: 0;
	position: absolute;
	width: 100%;
	height: 90%;
}

</style>
