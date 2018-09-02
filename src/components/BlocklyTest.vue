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

		// coderbot.cfg data (temp workaround, must be fetched from backend)
		var CODERBOT_MOV_FW_DEF_SPEED=100;
		var CODERBOT_MOV_FW_DEF_ELAPSE=1; // to check
		var CODERBOT_MOV_TR_DEF_SPEED=85;
		var CODERBOT_MOV_TR_DEF_ELAPSE=-1; // to check
		var CODERBOT_PROG_MOVE_MOTION=true; // to check
		var CODERBOT_PROG_MOVE_MPU=true; // to check
		var CODERBOT_PROG_LEVEL="adv";
		var CODERBOT_PROG_SCROLLBARS=true; // to check
		var CODERBOT_PROG_MAXBLOCKS=-1;
		var CODERBOT_PROG_SAVEONRUN=true; // to check
		var CODERBOT_CTRL_FW_SPEED=100;
		var CODERBOT_CTRL_FW_ELAPSE=1;
		var CODERBOT_CTRL_TR_SPEED=80;
		var CODERBOT_CTRL_TR_ELAPSE=0.5; // to check
		var CODERBOT_CTRL_COUNTER=true; // to check
		var CODERBOT_CTRL_MOVE_MOTION=true; // to check
		var CODERBOT_CTRL_MOVE_MPU=true; // to check
		var CODERBOT_CNN_MODEL_LIST=""

		var BotMessages = Object();
		BotMessages.Input = "Say what:";
		BotMessages.Saved = "Saved";
		BotMessages.ProgramSaved = "Program saved";
		BotMessages.ProgramExists = "Program name already in use, overwrite?";
		BotMessages.DeletePhoto = "Delete";
		BotMessages.DeletePhotoConfirm = "Delete photo ";
		BotMessages.CounterReset = "Reset move counter?"
		BotMessages.ProgramStatusRunning = "is running";
		BotMessages.ProgramStatusStop = "stopped";
		BotMessages.ProgramDialogStop = "Stop";
		BotMessages.ProgramDialogClose = "Close";
		BotMessages.UpdateSystem = "Update System? (this requires that CoderBot is connected to the internet (via wifi or lan cable, the operation will take a few minutes)."
		BotMessages.TagAlreadyExists = "Tag already exists.";
		BotMessages.ColorAtPoint = "Color at point: ";
		BotMessages.ModelTraining = "Model is training, check model lists to monitor training status.";

	}
};
</script>
