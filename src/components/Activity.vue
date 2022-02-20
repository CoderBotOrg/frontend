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
        <v-chip class="ma-2" v-if="activity.maxBlocks > 0" label>{{ $t("message.activity_program_remaining_blocks") }}: {{ remainingCapacity }}</v-chip>
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
        <blockly-workspace
          ref="workspace"
          :settings="settings"
          :toolbox="toolbox"
          @workspace-changed="onWorkspaceChanged()"
        >
        </blockly-workspace>
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
import 'prismjs';
import 'prismjs/components/prism-python.js';
import sidebar from './Sidebar';
import BlocklyWorkspace from './BlocklyWorkspace';

export default {
  name: 'Activity',
  components: {
    sidebar,
    BlocklyWorkspace,
    Prism: () => import('vue-prism-component')
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
    settings: {},
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
    toolbox: null,
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
    remainingCapacity() {
      return this.$refs.workspace.remainingCapacity();
    }
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
        this.settings.activity = response.data;
        this.updateCssProps();

        let toolboxJSON = null;
        if (this.activity.toolbox == null) {
          const toolboxLevel = this.settings.prog_level;
          // Decode it and get the clean serialized XML as plain string
          toolboxJSON = require(`../assets/toolbox_${toolboxLevel}.json`);
        } else {
          toolboxJSON = this.activity.toolbox;
        }
        this.toolbox = toolboxJSON;
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
        this.settings = { ...this.settings, ...response.data };
        if (this.toolbox == null) {
          const toolboxLevel = this.settings.prog_level;
          this.toolbox = require(`../assets/toolbox_${toolboxLevel}.json`);
        }
      });
  },
  beforeRouteLeave(to, from, next) {
    if (this.dirty) {
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

    onWorkspaceChanged() {
      this.dirty = true;
    },

    toggleSidebar() {
      const currentStatus = this.$store.getters.drawerStatus;
      this.$store.commit('toggleDrawer', !currentStatus);
    },

    getProgramData() {
      // Build the program object
      const name = this.programName;
      const { isDefault } = this;
      const { dom_code, code } = this.$refs.workspace.getProgramData();
      return {
        name,
        dom_code,
        code,
        default: isDefault,
      };
    },

    loadMusicPackages() {
      this.$axios.get(`${this.CB}/listMusicPackages`).then((result) => {
        this.settings.music_instruments = [];
        this.settings.music_animals = [];
        const music_packages = JSON.parse(result.data);
        Object.entries(music_packages).forEach((key) => {
          const package_key = key[0];
          const music_package = key[1];
          const names = [music_package.name_IT, package_key];
          if (music_package.category == 'instrument') {
            this.settings.music_instruments.push(names);
          } else if (music_package.category == 'animal') {
            this.settings.music_animals.push(names);
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
          this.$refs.workspace.loadProgram(importedProgram.dom_code);
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
            this.dirty = false;
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
      this.$data.carica = false;
      this.$data.programName = program;
      axios.get(`${CB}/load`, {
        params: {
          name: program,
        },
      }).then((data) => {
        console.log(data.data.dom_code);
        this.$refs.workspace.loadProgram(data.data.dom_code);
        this.$data.isDefault = data.data.default;
      });
    },

    clearProgramDlg() {
      this.$data.clear = true;
    },

    clearProgram() {
      this.$data.programName = '';
      this.$data.code = '';
      this.$refs.workspace.clear();
      this.$data.clear = false;
      this.dirty = true;
    },

    deleteProgramDlg(program) {
      this.$data.newProgramName = program;
      this.$data.del = true;
    },

    deleteProgram(program) {
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

    getProgramCode() {
      this.code = this.workspace.getProgramCode();
      this.dialogCode = true;
    },

    runProgram() {
      if (this.status) {
        const axios = this.$axios;
        const {
          CB
        } = this;
        // POST /program/save
        const options = this.activity;

        const { dom_code, code } = this.workspace.getProgramData();

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
