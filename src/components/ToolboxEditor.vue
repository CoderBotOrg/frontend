<template>
  <v-container class="grey lighten-5 mb-6 blockly-toolbox-editor">
    <v-row class="fill-height">
      <v-col class="pa-2 fill-height">
        <blockly-workspace
          ref="workspace_toolbox_editor"
          :settings="settings"
          :toolbox="toolbox_editor"
          @workspace-changed="onWorkspaceChanged()"
        >
        </blockly-workspace>
      </v-col>
      <v-col class="pa-2">
        <v-list>
          <v-list-item-group
            v-if="toolbox.kind=='categoryToolbox'"
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
        <v-btn @click="addCategory()">Aggiungi Nuova Categoria</v-btn>
        <v-btn @click="addAllCategories()">Aggiungi Tutte</v-btn>
      </v-col>
      <v-col class="pa-2 fill-height">
        <blockly-workspace
          ref="workspace_toolbox_test"
          :settings="settings"
          :toolbox="toolbox_in"
        >
        </blockly-workspace>
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
// import * as Blockly from 'blockly/core';

import BlocklyWorkspace from './BlocklyWorkspace.vue';

const categoryToolbox = 'categoryToolbox';
const flyoutToolbox = 'flyoutToolbox';

export default {
  components: {
    BlocklyWorkspace
  },
  props: ['toolbox_in'],
  data: () => ({
    CB: process.env.CB_ENDPOINT + process.env.APIv2,
    CBv1: process.env.CB_ENDPOINT,
    toolbox_editor: null,
    in_changing_category: false,
    settings: {},
    toolbox: {
      kind: categoryToolbox,
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

  beforeCreate() {
  },
  mounted() {
    const toolbox_full = require('../assets/toolbox_adv.json');
    this.toolbox_editor = toolbox_full;

    this.loadMusicPackages();

    if (this.toolbox_in) {
      this.toolbox = this.toolbox_in;
    }

    // Get the legacy configuration and initialize Blockly
    this.$axios.get(`${this.CBv1}/config`)
      .then((response) => {
        this.settings = { ...this.settings, ...response.data };
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

    onChangeCategory() {
      if (this.category_index != null
        && this.toolbox.kind == categoryToolbox) {
        const blockTypes = [];
        this.in_changing_category = true;
        this.toolbox.contents[this.category_index].contents.forEach((block) => {
          blockTypes.push(block.type);
        });
        this.$refs.workspace_toolbox_editor.addBlocks(blockTypes);
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

    addAllCategories() {
      this.toolbox.kind = categoryToolbox;
      this.toolbox.contents = this.toolbox.contents.concat(this.toolbox_editor.contents);
    },

    deleteCategory(i) {
      this.toolbox.contents.splice(i, 1);
      if (this.toolbox.contents.length == 0) {
        this.toolbox.kind = flyoutToolbox;
        console.log('category is now flyoutToolbox');
      }
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
        if (this.toolbox.kind == flyoutToolbox) {
          this.toolbox.kind = categoryToolbox;
          console.log('category is now categoryToolbox');
          category.contents = this.toolbox.contents;
          this.toolbox.contents = [];
        }
        this.toolbox.contents.push(category);
      }

      this.category_dialog = false;
    },

    upCategory(i) {
      this.toolbox.contents.splice(i - 1, 0, this.toolbox.contents[i]);
      this.toolbox.contents.splice(i + 1, 1);
    },

    downCategory(i) {
      this.toolbox.contents.splice(i + 2, 0, this.toolbox.contents[i]);
      this.toolbox.contents.splice(i, 1);
    },

    onWorkspaceChanged() {
      if (this.in_changing_category == false) {
        const contents = [];
        this.$refs.workspace_toolbox_editor.workspace.getTopBlocks(true).forEach((ablock) => {
          contents.push({
            kind: 'block',
            type: ablock.type
          });
        });
        if (this.toolbox.kind == categoryToolbox) {
          this.toolbox.contents[this.category_index].contents = contents;
        } else {
          this.toolbox.contents = contents;
        }
      }
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
