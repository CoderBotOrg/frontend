<template>
  <!-- Use computed CSS rules -->
  <div :style="cssProps">
    <v-app id="inspire">
      <!-- the mobile draw animation doesn't play well with how Blockly is draw -->
      <sidebar mobileDrawAnim=0></sidebar>
      <v-app-bar color="indigo" dark fixed app>
        <v-app-bar-nav-icon @click.stop="toggleSidebar()" v-if="activity.drawerEnabled"></v-app-bar-nav-icon>
        <v-app-bar-title class="title" v-if="activity.showName">
          <div>{{ activity.name }}</div>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-chip class="ma-2" v-if="activity.maxBlocks > 0" label>{{ $t("message.activity_program_remaining_blocks") }}: {{ remainingCapacity }}</v-chip>
        <!-- If the API is available, show the desired buttons -->
        <template v-for="button in activity.buttons">
          <template v-if="button.type == 'text'">
            <v-btn @click="this[button.action]()">
              <v-icon :icon="button.icon"></v-icon>
              <span v-if="activity.showButtonLabel">{{ button.label }}</span>
            </v-btn>
          </template>
          <template v-else>
            <v-btn @click="this[button.action]()" style="height: 70%" :color="button.colorBtn"
              :class="button.colorText">
              <v-icon :icon="button.icon"></v-icon>
              <span v-if="activity.showButtonLabel">{{ button.label }}</span>
            </v-btn>
          </template>
          &nbsp;&nbsp;
        </template>
      </v-app-bar>
      <!-- Page content -->
      <v-main>
        <!-- Blockly -->
        <blockly-workspace
          ref="workspace"
          :settings="settings"
          :toolbox="toolbox"
          :theme="theme.global.name.value"
          @workspace-changed="onWorkspaceChanged()"
        >
        </blockly-workspace>
      </v-main>
      <!-- Hidden file input. Its file dialog it's event-click triggered by the "pickFile" method -->
      <input type="file" style="display: none" ref="file" @change="importProgram">
      <!-- When the selection is completed, the result is then handled by importProgram -->
      <!--   Dialogs   -->
      <!-- Runtime -->
      <v-dialog v-model="runtimeDialog">
        <v-card style="width:500px;">
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
      <v-dialog v-model="carica" max-width="600">
        <v-card width="480">
          <v-card-title class="headline">
            {{ $t("message.program_list") }}
          </v-card-title>
          <v-list>
            <v-list-item v-for="program in programList" :key="program.el" @click="{}">
              <v-list-item-title ripple @click="loadProgram(program.name)">
                {{ program.name }}
              </v-list-item-title>
              <template v-slot:append>
                <v-btn v-if="!program.default" @click="deleteProgramDlg(program.name)">
                  <v-icon icon="mdi-delete"></v-icon>
                </v-btn>
              </template>
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
      <v-dialog v-model="save">
        <v-card style="width: 400px;">
          <v-card-title class="headline">
            {{ $t("message.save_as") }}
          </v-card-title>
            <v-card-text>
              <v-text-field v-model="newProgramName" v-bind:label="$t('message.save_as')" v-if="save">
              </v-text-field>
            </v-card-text>
          <v-card-actions>
            <v-btn color="red darken-1" text="text" @click="save = false">
              {{ $t("message.cancel") }}
            </v-btn>
            <v-btn color="green darken-1" text="text" @click="saveProgramAs(), save = false">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Name error -->
      <v-dialog v-model="invalidName" max-width="290">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
            {{ $t("message.program_name_must_be_filled") }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text="text" @click="invalidName = false, save = true">
              {{ $t("message.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Overwrite error -->
      <v-dialog v-model="cannotOverwrite" max-width="290">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
            {{ $t("message.cannot_overwrite_default_program") }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text="text" @click="cannotOverwrite = false, save = true">
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
            <v-btn color="red darken-1" text="text" @click="overwriteDialog = false, save = true">
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
              @click="del = false, carica = false, deleteProgram(programName)">
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
import Prism from 'vue-prism-component';
import { useTheme } from 'vuetify';
import sidebar from './Sidebar.vue';
import BlocklyWorkspace from './BlocklyWorkspace.vue';

export default {
  name: 'Activity',
  components: {
    sidebar,
    BlocklyWorkspace,
    Prism,
  },
  setup() {
    return {
      theme: useTheme(),
      settings: null,
      cssProps: {
        '--bodyFont': 'Roboto',
        '--codeFont': 'Ubuntu Mono',
      },
      experimental: 0,
      webcamStream: null,
      isDefault: '',
    };
  },
  data: () => ({
    activity: {
      exec: {},
    },
    toolbox: null,
    dialog: false,
    dialogCode: false,
    log: null,
    snackText: null,
    snackbar: false,
    drawer: false,
    code: '',
    generalDialog: false,
    generalDialogText: null,
    generalDialogTitle: null,
    execMode: 'fullExec', // can be 'fullExec' or 'stepByStep',
    carica: false,
    programList: '',
    save: false,
    programName: '',
    newProgramName: '',
    invalidName: false,
    del: false,
    clear: false,
    runtimeDialog: false,
    cannotOverwrite: false,
    defaultProgramName: '',
    overwrite: true,
    overwriteDialog: false,
    dirty: false,
    confirm_exit_dialog: null,
    router_next: null,
    program_status: null
  }),
  computed: {
    remainingCapacity() {
      return this.$refs.workspace.remainingCapacity();
    },
  },
  mounted() {
    this.webcamStream = this.$coderbot.streamVideoURL();
    this.settings = this.$store.getters.settings;
    // Get the activity
    let activityName = this.$route.params.name;
    let activityDefault = false;
    if (this.$router.name == 'program') {
      activityName = this.$route.params.name;
      activityDefault = true;
    }
    this.$coderbot.loadActivity(activityName, activityDefault).then((activity) => {
      this.activity = activity.data;
      if (this.activity.uiLang != 'browser') {
        this.$i18n.locale = this.activity.uiLang;
      }
      this.theme.global.name.value = this.activity.theme != 'dark' ? 'light' : 'dark';
      this.settings.maxBlocks = this.activity.maxBlocks;
      this.updateCssProps();

      this.toolbox = this.activity.toolbox;
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
      this.save = true;
      this.newProgramName = this.programName;
    },

    saveProgramAs() {
      if (this.newProgramName != '') {
        if (this.isDefault == 'True' && this.programName == this.newProgramName) {
          this.cannotOverwrite = true;
          console.log('error');
        } else {
          this.defaultProgramName = this.programName;
          this.programName = this.newProgramName;
          this.newProgramName = '';
          this.$data.overwrite = false;
          this.saveProgram();
        }
      } else {
        this.invalidName = true;
      }
    },

    saveProgram() {
      if (this.programName != '') {
        const data = this.getProgramData();
        this.$coderbot.saveProgram(this.$data.overwrite, data.name, data.dom_code, data.code, '').then((prog_data) => {
          if (prog_data.data == 'defaultOverwrite' || prog_data.data == 'askOverwrite') {
            if (prog_data.data == 'askOverwrite') {
              this.$data.overwriteDialog = true;
            } else {
              this.$data.programName = this.$data.defaultProgramName;
              this.$data.defaultProgramName = '';
              this.$data.cannotOverwrite = true;
            }
          } else {
            this.$data.isDefault = '';
            this.$data.overwrite = true;
            console.log('saved');
            this.dirty = false;
          }
        });
      } else {
        this.invalidName = true;
      }
    },

    loadProgramList() {
      // Get the list of available programs and populate the popup
      this.$coderbot.listPrograms()
        .then((response) => {
          this.$data.carica = true;
          this.$data.programList = response.data;
        });
    },

    loadProgram(program) {
      this.$data.carica = false;
      this.$data.programName = program;
      this.$coderbot.loadProgram(this.$data.programName).then((data) => {
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
      console.log(program)
      this.$data.programName = program;
      this.$data.del = true;
    },

    deleteProgram(program) {
      if (this.$data.programName == program) {
        this.$data.programName = '';
        this.$data.code = '';
        this.$refs.workspace.clear();
      }
      console.log('delete');
      this.$coderbot.deleteProgram(program).then(() => {
        console.log('deleted');
      });
    },

    getProgramCode() {
      this.code = this.$refs.workspace.getProgramCode();
      this.dialogCode = true;
    },

    runProgram() {
      // POST /program/save
      const { code } = this.$refs.workspace.getProgramData();
      const programName = this.programName != '' ? this.programName : 'untitled';
      this.$coderbot.runProgram(programName, code).then(() => {
        this.runtimeDialog = true;
        setTimeout(() => {
          this.updateExecStatus();
        }, 1000);
      });
    },

    stopProgram() {
      console.log('Stopping');
      this.$coderbot.stopProgram();
    },

    updateExecStatus() {
      console.log('Updating Execution status');
      this.$coderbot.programStatus()
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
