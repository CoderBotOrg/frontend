<template>
 <div class="hello">
 	aa
   <div ref="blocklyDiv" id="blocklyDiv" style="height: 480px; width: 600px;"></div>
</div>
</template>



<script>
// var workspace = Blockly.inject('blocklyDiv', {toolbox: this.$refs.toolbox});

export default {
  name: 'BlocklyTest',
  data() {
    return {
      toolbox: require('../assets/toolbox_advanced.xml'),
    };
  },
  mounted() {

    var b64Toolbox = this.toolbox.substring(21).toString()
    var serializedToolbox = this.$base64.decode(b64Toolbox)
    
  	var workspace = Blockly.inject(this.$refs.blocklyDiv, {toolbox:serializedToolbox});

  }
};
</script>
