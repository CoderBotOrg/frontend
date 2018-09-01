<template>
	<div>
		<div ref="blocklyDiv" id="blocklyDiv" style="height: 480px; width: 600px;">
		</div>
	</div>
</template>



<script>
export default {
	name: 'Blockly',
	data() {
		return {
			test: 'a',
		};
	},
	mounted() {
		// Should be dependent on the chosen toolbox,
		//  possibly an AJAX call if it's a custom toolbox (?)
		var toolbox = require('../assets/toolbox_advanced.xml')
		// Clean the base64 encoding of the resource, removing meta infos
		var b64Toolbox = toolbox.substring(21).toString()
		// Decode it and get the clean serialized XML as plain string
		var serializedToolbox = this.$base64.decode(b64Toolbox)
		
		// Initialise Blockly Instance
		var workspace = Blockly.inject(
			// Blockly container
			this.$refs.blocklyDiv,
			// Options
			{
				toolbox:serializedToolbox
			});

	}
};
</script>
