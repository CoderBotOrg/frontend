<template> 
 <div class="hello"> 
 	aa
   <div id="blocklyDiv" style="height: 480px; width: 600px;">
   </div> 
    <xml id="toolbox" ref=toolbox style="display: none"> 
     <block type="controls_if"></block> 
     <block type="text"></block> <block type="text_print"></block> 
    </xml> 
   </div> 
</template>

<script> 

 var workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')}); 
</script>