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
      toolbox: '<xml><block type="controls_if"></block></xml>',
    };
  },
  mounted(){
  	var workspacePlayground = Blockly.inject(this.$refs.blocklyDiv, {toolbox:this.toolbox});
    console.log(this.$refs.blocklyDiv)
  }
};
</script>