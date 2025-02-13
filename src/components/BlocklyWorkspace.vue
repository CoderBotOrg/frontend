<template>
  <div style="height: 480px; width: 100%">
    <div ref="blocklyTotal" style="height: 100%; width: 100%;" class="blocklyTotal">
      <div ref="blocklyArea" style="height: 100%; width: 100%;" class="blocklyArea">
        <div ref="blocklyDiv" style="height: 100%; width: 100%;" class="blocklyDiv">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python';
var Blockly_Python = pythonGenerator;

import DarkTheme from '@blockly/theme-dark';
import 'blockly/blocks';
import 'blockly/python';
import * as blockly_it from 'blockly/msg/it';
import * as blockly_en from 'blockly/msg/en';
import * as blockly_fr from 'blockly/msg/fr';
import * as blockly_es from 'blockly/msg/es';
import * as blockly_de from 'blockly/msg/de';

import '../assets/js/blockly/blocks';
import * as bot_it from '../assets/js/blockly/bot_it.json';
import * as bot_en from '../assets/js/blockly/bot_en.json';
import * as bot_fr from '../assets/js/blockly/bot_fr.json';
import * as bot_es from '../assets/js/blockly/bot_es.json';
import * as bot_de from '../assets/js/blockly/bot_de.json';

import i18n from '../i18n/index';

const locale = i18n.global.locale.substring(0, 2);

const coderbot_locales = {
  it: bot_it.default,
  en: bot_en.default,
  fr: bot_fr.default,
  es: bot_es.default,
  de: bot_de.default
};

Blockly.setLocale(coderbot_locales[locale]);

const blockly_locales = {
  it: blockly_it,
  en: blockly_en,
  fr: blockly_fr,
  es: blockly_es,
  de: blockly_de
};
Blockly.setLocale(blockly_locales[locale]);

Blockly.Blocks.CoderBotSettings.instrumentlist = [];
Blockly.Blocks.CoderBotSettings.animalist = [];

export default {
  name: 'BlocklyWorkspace',
  props: [
    'settings',
    'toolbox',
    'theme',
  ],
  setup() {
    return {
      workspace: null
    };
  },
  data() {
    return {
      toolbox_kind: null
    };
  },
  watch: {
    // whenever settings changes, this function will run
    settings(newSettings, oldSettings) {
      if (newSettings != oldSettings) {
        this.initBlockly(this.settings);
      }
    },
    toolbox: {
      /* eslint-disable func-names, object-shorthand */
      handler: function (newToolbox) {
        if (this.workspace) {
          if (newToolbox.kind != this.toolbox_kind) {
            this.workspace.dispose();
            this.initBlockly(this.settings);
            this.toolbox_kind = this.toolbox.kind;
          } else {
            this.workspace.updateToolbox(this.toolbox);
          }
        }
      },
      deep: true
      /* eslint-enable */
    }
  },
  methods: {
    initBlockly(settings) {
      // Extend the default blocks set
      this.blocksExtensions(settings);

      // Initialise Blockly Instance
      // Blockly.Generator.prototype.INDENT = '    ';
      this.workspace = Blockly.inject(
        // Blockly container
        this.$refs.blocklyDiv,
        // Options
        {
          toolbox: this.toolbox,
          media: 'media/',
          theme: this.theme == 'dark' ? DarkTheme : null,
          // TODO: Use values from fetched configuration!
          scrollbars: true,
          maxBlocks: settings.maxBlocks,
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
            pinch: true
          },
        },
      );

      const {
        workspace
      } = this;
      this.workspace.dirty = false;
      this.workspace.addChangeListener(() => {
        workspace.dirty = true;
      });
      const component = this;
      function onToolboxEditorChange(event) {
        if (event.type == Blockly.Events.BLOCK_CREATE
            || event.type == Blockly.Events.BLOCK_DELETE
            || event.type == Blockly.Events.BLOCK_MOVE) {
          component.$emit('workspace-changed');
        }
      }
      this.workspace.addChangeListener(onToolboxEditorChange);

      // Pass the reference to the method to call, don't execute it (`()`)
      // window.addEventListener('resize', this.resizeWorkspace, false);

      // Initial resize
      // this.resizeWorkspace()
      // Blockly.svgResize(this.workspace);
    },
    blocksExtensions(settings) {
      Blockly.Blocks.CoderBotSettings.instrumentlist = this.$store.getters.musicInstruments;
      Blockly.Blocks.CoderBotSettings.animalist = this.$store.getters.musicAnimals;
      // coderbot.cfg data (temp workaround, must be fetched from backend)
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED = settings.moveFwdSpeed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE = settings.moveFwdElapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED = settings.moveTurnSpeed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE = settings.moveTurnElapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION = settings.movementUseMotion; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU = settings.movementUseMPU; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_ENCODER_AVAILABLE = settings.movementUseEncoder; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_LEVEL = settings.progLevel;
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_SCROLLBARS = true; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MAXBLOCKS = -1;
      Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_SAVEONRUN = true; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_FW_SPEED = settings.ctrlFwdSpeed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_FW_ELAPSE = settings.ctrlFwdElapse;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_TR_SPEED = settings.ctrlTurnSpeed;
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_TR_ELAPSE = settings.ctrlTurnElapse; // to check
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_COUNTER = true; // to check, never used
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_MOVE_MOTION = settings.movementUseMotion; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_CTRL_MOVE_MPU = settings.movementUseMPU; // should come from config
      Blockly.Blocks.CoderBotSettings.CODERBOT_CNN_MODEL_LIST = [
        ['generic_fast_low', 'generic_fast_low'],
        ['generic_slow_high', 'generic_slow_high'],
        ['generic_object_detect', 'generic_object_detect']
      ];
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

    addBlocks(blockTypes) {
      if (this.workspace) {
        this.workspace.clear();
        let y = 5;
        blockTypes.forEach((block) => {
          const parentBlock = this.workspace.newBlock(block);
          parentBlock.initSvg();
          parentBlock.render();
          parentBlock.moveTo(new Blockly.utils.Coordinate(5, y));
          y += parentBlock.getHeightWidth().height + 20;
        });
      }
    },
    getProgramData() {
      const xml_code = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      const dom_code = Blockly.Xml.domToText(xml_code);
      window.LoopTrap = 1000;
      Blockly_Python.INFINITE_LOOP_TRAP = 'get_prog_eng().check_end()\n';
      const code = Blockly_Python.workspaceToCode(this.workspace);
      Blockly_Python.INFINITE_LOOP_TRAP = null;
      return {
        dom_code,
        code,
      };
    },

    getProgramCode() {
      Blockly_Python.STATEMENT_PREFIX = null;
      Blockly_Python.addReservedWords();
      Blockly_Python.INFINITE_LOOP_TRAP = null;
      const code = Blockly_Python.workspaceToCode(this.workspace);

      return code;
    },

    loadProgram(dom_code) {
      this.workspace.clear();
      const xml = Blockly.utils.xml.textToDom(dom_code);
      Blockly.Xml.domToWorkspace(xml, this.workspace);
    },

    clear() {
      this.workspace.clear();
    },

    remainingCapacity() {
      let capacity = null;
      if (this.workspace) {
        capacity = this.workspace.remainingCapacity();
      }
      return capacity;
    }
  },
};
</script>
<style scoped>
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
