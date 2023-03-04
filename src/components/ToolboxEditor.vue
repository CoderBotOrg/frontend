<template>
  <v-container class="grey lighten-5 mb-6 _blockly-toolbox-editor">
    <v-row>
      <v-col class="pa-2 blockly-toolbox-editor">
        <blockly-workspace
          ref="workspace_toolbox_editor"
          :settings="settings"
          :toolbox="toolbox_editor"
          @workspace-changed="onWorkspaceChanged()"
        >
        </blockly-workspace>
      </v-col>
      <v-col class="pa-2">
        <v-list v-if="toolbox.kind=='categoryToolbox'">
          <!--v-list-group
            v-if="toolbox.kind=='categoryToolbox'"
            v-model="category_index"
            color="primary"
            mandatory
            @change="onChangeCategory()"
          -->
            <v-list-item
              link
              v-for="(category, i) in toolbox.contents"
              :key="i"
              :title="category.name"
              @click="onChangeCategory(i)"
              >
              <template v-slot:append>
                <span>
                <v-icon @click="editCategory(i)" icon=mdi-pencil></v-icon>
                </span>
                <span>
                <v-icon @click="upCategory(i)" icon="mdi-arrow-up"></v-icon>
                </span>
                <span>
                <v-icon @click="downCategory(i)" icon="mdi-arrow-down"></v-icon>
                </span>
                <span>
                <v-icon @click="deleteCategory(i)" icon="mdi-delete"></v-icon>
                </span>
              </template>
            </v-list-item>
          <!--/v-list-group-->
        </v-list>
        <v-btn @click="addCategory()" id="add_category">{{ $t('message.activity_toolbox_category_add') }}</v-btn>
        <v-btn @click="addAllCategories()" id="add_category_all">{{ $t('message.activity_toolbox_category_add_all') }}</v-btn>
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
          <v-text-field v-model="category.name" v-bind:label="$t('message.activity_category_name')" id="category_name"></v-text-field>
          <v-color-picker
            dot-size="29"
            hide-canvas
            hide-inputs
            show-swatches
            v-model="category.color_rgb"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="category_dialog = false">{{ $t("message.cancel") }}</v-btn>
          <v-btn @click="saveCategory()" id="save_category">{{ $t("message.ok") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="js">
import BlocklyWorkspace from './BlocklyWorkspace.vue';
import * as toolbox_full from '@/assets/toolbox_adv.json';

const categoryToolbox = 'categoryToolbox';
const flyoutToolbox = 'flyoutToolbox';

export default {
  components: {
    BlocklyWorkspace
  },
  props: ['toolbox_in'],
  data: () => ({
    toolbox_editor: null,
    in_changing_category: false,
    settings: {},
    toolbox: {
      kind: categoryToolbox,
      contents: []
    },
    category: {
      name: '',
      color_rgb: {
        h: 300, s: 1, l: 0.5, a: 1
      },
      contents: []
    },
    category_dialog: null,
    category_index: null
  }),
  mounted() {
    // i18n toolbox categories
    toolbox_full.contents.forEach((item) => {
      if (item.name.startsWith('message.')) {
        /* eslint-disable no-param-reassign */
        item.name = this.$i18n.t(item.name);
      }
    });
    this.toolbox_editor = toolbox_full;

    if (this.toolbox_in) {
      this.toolbox = this.toolbox_in;
    }

    // Get the legacy configuration and initialize Blockly
    this.settings = this.settings = this.$store.getters.settings;
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
    onChangeCategory(i) {
      this.category_index = i;
      if (this.category_index != null
        && this.toolbox.kind == categoryToolbox) {
        const blockTypes = [];
        this.in_changing_category = true;
        if (this.toolbox.contents[this.category_index].contents != null) {
          this.toolbox.contents[this.category_index].contents.forEach((block) => {
            blockTypes.push(block.type);
          });
          this.$refs.workspace_toolbox_editor.addBlocks(blockTypes);
        }
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
      console.log(this.category.color_rgb);
      const category = {
        name: this.category.name,
        // colour: this.category.color_rgb.hsla.h,
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
        console.log('saveCategory.end');
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
          const inputlist = {};
          let i = 0;
          ablock.inputList.forEach((aninput) => {
            /* eslint-disable no-underscore-dangle */
            if (aninput.type == 1 && ablock.childBlocks_.length > i) {
              inputlist[aninput.name] = {
                shadow: {
                  kind: 'block',
                  /* eslint-disable no-underscore-dangle */
                  type: ablock.childBlocks_[i].type
                }
              };
              i++;
            }
          });
          contents.push({
            kind: 'block',
            type: ablock.type,
            inputs: inputlist
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

.blocklyFlyout {
  z-index: 1 !important;
}
</style>
