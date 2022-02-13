<template>
  <v-container class="grey lighten-5 mb-6 blockly-toolbox-editor">
    <v-row class="fill-height">
      <v-col class="pa-2 fill-height">
        <div ref="toolboxEditorBlocklyTotal" class="blocklyTotal fill-height">
          <div ref="toolboxEditorBlocklyArea" class="blocklyArea fill-height">
            <div ref="toolboxEditorBlocklyDiv" class="blocklyDiv fill-height">
            </div>
          </div>
        </div>
      </v-col>
      <v-col class="pa-2">
        <v-list>
          <v-list-item-group
            v-model="category_index"
            color="primary"
            mandatory
            @change="onChangeCategory()"
          >
            <v-list-item
              v-for="(category, i) in toolbox.contents"
              :key="i"
              >
              <v-list-item-content>
                <v-list-item-title v-text="category.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon @click="editCategory(i)">edit</v-icon>
                <v-icon @click="upCategory(i)">mdi-arrow-up</v-icon>
                <v-icon @click="downCategory(i)">mdi-arrow-down</v-icon>
                <v-icon @click="deleteCategory(i)">delete</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-btn @click="addCategory()">Aggiungi Categoria</v-btn>
      </v-col>
      <v-col class="pa-2 fill-height">
        <div class="fill-height">
          <div ref="toolboxTesterBlocklyTotal" class="blocklyTotal fill-height">
            <div ref="toolboxTesterBlocklyArea" class="blocklyArea fill-height">
              <div ref="toolboxTesterBlocklyDiv" class="blocklyDiv fill-height">
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="category_dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ $t("message.activity_category_title") }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="category.name" v-bind:label="$t('message.activity_category_name')"></v-text-field>
          <v-color-picker
            dot-size="29"
            hide-canvas
            hide-inputs
            show-swatches
            swatches-max-height="148"
            v-model="category.color_rgb"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="category_dialog = false">{{ $t("message.cancel") }}</v-btn>
          <v-btn @click="saveCategory()">{{ $t("message.ok") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
  props: ['toolbox_in'],
  data: () => ({
    CB: process.env.CB_ENDPOINT + process.env.APIv2,
    CBv1: process.env.CB_ENDPOINT,
    workspace_toolbox_editor: null,
    workspace_toolbox_test: null,
    in_changing_category: true,
    toolbox: {
      kind: 'categoryToolbox',
      contents: []
    },
    category: {
      name: '',
      color_rgb: '',
      contents: []
    },
    category_dialog: null,
    category_index: null
  }),

  mounted() {
    if (this.toolbox_in) {
      this.toolbox = this.toolbox_in;
    }

    this.loadMusicPackages();

    const axios = this.$axios;

    // Get the legacy configuration and initialize Blockly
    axios.get(`${this.CBv1}/config`)
      .then((response) => {
        const settings = response.data;
        this.settings = settings;
        this.initBlockly(settings);
        if (this.toolbox.contents.length) {
          this.onChangeCategory();
        }
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

    onChangeCategory() {
      if (this.category_index != null
          && this.workspace_toolbox_editor != null) {
        this.in_changing_category = true;
        this.workspace_toolbox_editor.clear();
        let y = 0;
        this.toolbox.contents[this.category_index].contents.forEach((block) => {
          const parentBlock = this.workspace_toolbox_editor.newBlock(block.type);
          parentBlock.initSvg();
          parentBlock.render();
          parentBlock.moveTo(new Blockly.utils.Coordinate(5, y));
          y += parentBlock.getHeightWidth().height + 10;
        });
        this.in_changing_category = false;
      }
    },

    addCategory() {
      this.category = {
        name: '',
        contents: []
      };
      this.category_edit = false;
      this.category_dialog = true;
    },

    deleteCategory(i) {
      this.toolbox.contents.splice(i, 1);
      this.workspace_toolbox_test.updateToolbox(this.toolbox);
    },

    editCategory(i) {
      this.category_index = i;
      this.category = this.toolbox.contents[i];
      this.category_edit = true;
      this.category_dialog = true;
    },

    saveCategory() {
      const category = {
        name: this.category.name,
        colour: this.category.color_rgb.hsla.h,
        kind: 'category',
        contents: []
      };
      if (this.category_edit) {
        this.toolbox.contents[this.category_index] = category;
      } else {
        this.toolbox.contents.push(category);
      }

      this.category_dialog = false;
      this.workspace_toolbox_test.updateToolbox(this.toolbox);
    },

    upCategory(i) {
      this.toolbox.contents.splice(i - 1, 0, this.toolbox.contents[i]);
      this.toolbox.contents.splice(i + 1, 1);
      this.workspace_toolbox_test.updateToolbox(this.toolbox);
    },

    downCategory(i) {
      this.toolbox.contents.splice(i + 2, 0, this.toolbox.contents[i]);
      this.toolbox.contents.splice(i, 1);
      this.workspace_toolbox_test.updateToolbox(this.toolbox);
    },

    initBlockly() {
      // Extend the default blocks set
      this.blocksExtensions();

      const toolbox_full = require('../assets/toolbox_adv.xml');

      // Clean the base64 encoding of the resource, removing meta infos
      const b64Toolbox = toolbox_full.substring(toolbox_full.indexOf(',') + 1).toString();

      // Decode it and get the clean serialized XML as plain string
      const serializedToolbox = this.$base64.decode(b64Toolbox);

      // Initialise Blockly Instance Toolbox Editor
      this.workspace_toolbox_editor = Blockly.inject(
        // Blockly container
        this.$refs.toolboxEditorBlocklyDiv,
        // Options
        {
          toolbox: serializedToolbox,
          // path: 'static/js/blockly/',
          // TODO: Use values from fetched configuration!
          scrollbars: true,
          // maxBlocks: this.activity.maxBlocks,
          zoom: {
            controls: false,
            wheel: false,
            startScale: 1.0,
            maxScale: 1.5,
            minScale: 0.2,
          },
        },
      );

      // Initialise Blockly Instance Toolbox Editor
      this.workspace_toolbox_test = Blockly.inject(
        // Blockly container
        this.$refs.toolboxTesterBlocklyDiv,
        // Options
        {
          toolbox: this.toolbox,
          // path: 'static/js/blockly/',
          // TODO: Use values from fetched configuration!
          scrollbars: false,
          zoom: {
            controls: false,
            wheel: false,
            startScale: 1.0,
            maxScale: 1.5,
            minScale: 0.2,
          },
        },
      );

      const workspace_toolbox_editor = this.workspace_toolbox_editor;
      const workspace_toolbox_test = this.workspace_toolbox_test;
      const toolbox = this.toolbox;
      const state = this;
      function onToolboxEditorChange(event) {
        if ((event.type == Blockly.Events.BLOCK_CREATE
            || event.type == Blockly.Events.BLOCK_DELETE
            || event.type == Blockly.Events.BLOCK_MOVE)
            && state.in_changing_category == false) {
          toolbox.contents[state.category_index].contents = [];
          workspace_toolbox_editor.getTopBlocks(true).forEach((ablock) => {
            toolbox.contents[state.category_index].contents.push({
              kind: 'block',
              type: ablock.type
            });
          });
          workspace_toolbox_test.updateToolbox(toolbox);
        }
      }
      workspace_toolbox_editor.addChangeListener(onToolboxEditorChange);
      /*
      const blocklyArea = this.$refs.toolboxEditorBlocklyArea;
      const blocklyDiv = this.$refs.toolboxEditorBlocklyDiv;
      const workspace_toolbox_editor = this.workspace_toolbox_editor;
      const onresize = function () {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        console.log(blocklyArea);
        let element = blocklyArea;
        let x = 0;
        let y = 0;
        do {
          x += element.offsetLeft;
          y += element.offsetTop;
          element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        /* eslint-disable prefer-template */ /*
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace_toolbox_editor);
      };
      window.addEventListener('resize', onresize, false);
      onresize();
      Blockly.svgResize(workspace_toolbox_editor);
      */
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

.blocklyToolboxDiv {
  z-index: 1 !important;
}
.blockly-toolbox-editor {
  height: 480px;
}
</style>
