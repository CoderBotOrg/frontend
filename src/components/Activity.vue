<template>
	<!-- Use computed CSS rules -->
	<div :style="cssProps">
		<v-app id="inspire">
			<!-- the mobile draw animation doesn't play well with how Blockly is draw -->
			<sidebar mobileDrawAnim=0></sidebar>
			<v-toolbar color="indigo" dark fixed app>
				<v-toolbar-side-icon @click.stop="toggleSidebar()" v-if="activity.drawerEnabled"></v-toolbar-side-icon>
				<v-toolbar-title v-if="activity.showName">
					{{ activity.name }}
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<!-- If the API is available, show the desired buttons -->
					<template v-if="status == 200">
						<template v-for="button, i in activity.buttons">
							<v-btn @click="_self[button.action]()" style="height: 70%" :color="button.colorBtn" :class="button.colorText">
								{{ button.label }}
								<v-icon right dark>{{ button.icon }}</v-icon>
							</v-btn>
							&nbsp;&nbsp;
						</template>
					</template>
					<!-- If the API is not responding, show an error icon -->
					<v-btn @click="dialog = true" icon v-if="status != 200">
						<v-icon>error</v-icon>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<!-- Page content -->
			<v-content>
				<!-- Blockly -->
				<div style="height: 480px; width: 600px;">
					<div ref="blocklyTotal" style="height: 100%; width: 100%;" class="blocklyTotal">
						<div ref="blocklyArea" style="height: 100%; width: 100%;" class="blocklyArea">
							<div ref="blocklyDiv" style="height: 100%; width: 100%;" class="blocklyDiv">
							</div>
						</div>
					</div>
				</div>
			</v-content>
			<!-- Hidden file input. Its file dialog it's event-click triggered by the "pickFile" method -->
			<input type="file" style="display: none" ref="file" @change="importProgram">
			<!-- When the selection is completed, the result is then handled by importProgram -->
			<!--   Dialogs   -->
			<!-- Runtime -->
			<v-dialog v-model="runtimeDialog" width="500">
				<v-card>
					<v-card-title class="headline grey lighten-2" primary-title>
						Esecuzione
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
						<v-btn color="primary" flat @click="runtimeDialog = false; stopProgram()">
							Chiudi
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Load Program -->
			<v-dialog v-model="carica" max-width="290">
				<v-card>
					<v-card-title class="headline">
						Lista Programmi
					</v-card-title>
					<v-list>
						<v-list-tile v-for="program in programList" :key="program.el" avatar @click="">
							<v-list-tile-title ripple @click="loadProgram(program.name)">
								{{ program.name }}
							</v-list-tile-title>
							<v-btn v-if="program.default != 'True'" flat icon color="grey darken-1" ripple @click="deleteProgramDlg(program.name)">
								<v-icon>delete</v-icon>
							</v-btn>
						</v-list-tile>
					</v-list>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="green darken-1" flat="flat" @click="carica = false">
							Annulla
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Save Program -->
			<v-dialog v-model="salva" max-width="430">
				<v-card>
					<v-card-title class="headline">
						Salva con nome
					</v-card-title>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-card-text>
							<v-text-field v-model="newProgramName" label="Nome del programma" v-if="salva" onClick="this.select()" v-on:keyup.enter="saveProgramAs(), salva = false" v-on:keyup.esc="salva = false" autofocus></v-text-field>
						</v-card-text>
						<v-btn color="red darken-1" flat="flat" @click="salva = false">
							Annulla
						</v-btn>
						<v-btn color="green darken-1" flat="flat" @click="saveProgramAs(), salva = false">
							Ok
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Name error -->
			<v-dialog v-model="unvalidName" max-width="290">
				<v-card>
					<v-card-title class="headline">Error</v-card-title>
					<v-card-text>
						Il nome del programma non può essere vuoto.
					</v-card-text>
					<v-card-actions>
						<v-btn color="green darken-1" flat="flat" @click="unvalidName = false, salva = true">
							Ok
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Overwrite error -->
			<v-dialog v-model="CannotOverwrite" max-width="290">
				<v-card>
					<v-card-title class="headline">Error</v-card-title>
					<v-card-text>
						Impossibile sovrascrivere un programma di default, cambiare il nome.
					</v-card-text>
					<v-card-actions>
						<v-btn color="green darken-1" flat="flat" @click="CannotOverwrite = false, salva = true">
							Ok
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Ask for overwrite -->
			<v-dialog v-model="overwriteDialog" max-width="500">
				<v-card>
					<v-card-title class="headline">
						Sovrascrivi
					</v-card-title>
					<v-card-actions>
						<v-card-text>
							Esiste già un programma con nome : "{{programName}}" vuoi sovrascriverlo?
						</v-card-text>
						<v-btn color="red darken-1" flat="flat" @click="overwriteDialog = false, salva = true">
							No
						</v-btn>
						<v-btn color="green darken-1" flat="flat" @click="overwrite = 1, overwriteDialog = false, saveProgram()">
							Si
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Delete Program -->
			<v-dialog v-model="del" max-width="500">
				<v-card>
					<v-card-title class="headline">
						Cancella
					</v-card-title>
					<v-card-actions>
						<v-card-text>
							Sei sicuro di voler cancellare: "{{newProgramName}}"?
						</v-card-text>
						<v-btn color="red darken-1" flat="flat" @click="del = false">
							No
						</v-btn>
						<v-btn color="green darken-1" flat="flat" @click="del = false, carica = false, deleteProgram(newProgramName)">
							Si
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
						<v-btn color="green darken-1" flat="flat" @click="dialogCode = false">
							Ok
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Status -->
			<v-dialog v-model="dialog" max-width="290">
				<v-card>
					<v-card-title class="headline">Stato del Coderbot</v-card-title>
					<v-card-text>
						{{ statusText }}
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="green darken-1" flat="flat" @click="dialog = false">
							Ok
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
						<v-btn color="green darken-1" flat="flat" @click="generalDialog = false">
							Ok
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Notification Snackbar -->
			<v-snackbar v-model="snackbar">
				{{ snackText }}
				<v-btn color="pink" flat @click="snackbar = false">
					Chiudi
				</v-btn>
			</v-snackbar>
		</v-app>
	</div>
</template>
<script>
import 'prismjs'
import 'prismjs/components/prism-python.js'
import sidebar from '../components/Sidebar'

export default {
	name: 'Blockly',
	components: {
		sidebar,
		Prism: () =>
			import('vue-prism-component')
	},
	data: () => ({
		cssProps: {
			'--bodyFont': 'Roboto',
			'--codeFont': 'Ubuntu Mono',
		},
		activityStyle: null,
		activity: {
			exec: {},
		},
		log: null,
		settings: null,
		snackText: null,
		snackbar: false,
		drawer: false,
		tabs: null,
		dialog: false,
		dialogCode: false,
		CB: process.env.CB_ENDPOINT + process.env.APIv2,
		CBv1: process.env.CB_ENDPOINT,
		status: null,
		code: '',
		workspace: null,
		generalDialog: false,
		generalDialogText: null,
		generalDialogTitle: null,
		experimental: 0,
		execMode: "fullExec", // can be 'fullExec' or 'stepByStep',
		carica: false,
		programList: '',
		salva: false,
		programName: '',
		newProgramName: '',
		unvalidName: false,
		del: false,
		webcamStream: process.env.CB_ENDPOINT + process.env.APIv1 + '/video/stream',
		runtimeDialog: false,
		isDefault: '',
		CannotOverwrite: false,
		defaultProgramName: '',
		overwrite: 0,
		overwriteDialog: false,
	}),
	computed: {
		statusText: function() {
			if (this.status) {
				return 'Coderbot risulta online e funzionante. '
			} else {
				return 'Coderbot risulta offline e rotto'
			}
		}
	},
	mounted() {
		// Get the activity
		let axios = this.$axios
		let CB = this.CB
		console.log("Loading activity", this.$route.params.name)
		this.saved = true;
		axios.get(CB + '/loadActivity', {
				params: {
					name: this.$route.params.name
				}
			})
			.then(function(response) {
				console.log("Activity loaded", response.data)
				this.activity = response.data
				this.updateCssProps()

			}.bind(this))


		this.status = null
		this.pollStatus();

		// Start the polling
		setInterval(function() {
			this.pollStatus();
		}.bind(this), 1000)

		// Get the legacy configuration and initialize Blockly
		axios.get(this.CBv1 + '/config')
			.then(function(response) {
				var settings = response.data
				this.settings = settings
				this.initBlockly(settings)
			}.bind(this))

	},
	methods: {
		updateCssProps() {
			// (Re)Compute the CSS variables from the activity definition, then update them
			console.log("Computing CSS Props")
			let bodyFont = this.activity.bodyFont
			let fontFamilyBody = ''
			if (bodyFont == 'opensans') {
				fontFamilyBody = 'Open Sans'
			} else if (bodyFont == 'roboto') {
				fontFamilyBody = 'Roboto'
			}
			let codeFont = this.activity.codeFont
			let fontFamilyCode = ''
			if (codeFont == 'ubuntumono') {
				fontFamilyCode = 'Ubuntu Mono'
			} else if (codeFont == 'robotomono') {
				fontFamilyCode = 'Roboto Mono'
			}
			let textTransform = ''
			if (this.activity.capsSwitch) {
				textTransform = 'uppercase'
			} else {
				textTransform = 'none'
			}

			this.cssProps = {
				'--bodyFont': fontFamilyBody,
				'--codeFont': fontFamilyCode,
				'--transform': textTransform,
			}
			console.log("Computed CSS props:", this.cssProps)
		},

		initBlockly(settings) {
			// Extend the default blocks set
			this.blocksExtensions(settings);

			let toolboxLevel = settings.prog_level
			var toolbox = require('../assets/toolbox_' + toolboxLevel + '.xml')

			// Clean the base64 encoding of the resource, removing meta infos
			var b64Toolbox = toolbox.substring(21).toString()
			// Decode it and get the clean serialized XML as plain string
			var serializedToolbox = this.$base64.decode(b64Toolbox)

			// Initialise Blockly Instance
			this.workspace = Blockly.inject(
				// Blockly container
				this.$refs.blocklyDiv,
				// Options
				{
					toolbox: serializedToolbox,
					path: 'static/js/blockly/',
					// TODO: Use values from fetched configuration!
					scrollbars: true,
					//MaxBlocks		: -1, // -1 as infinite not working FIXME
					zoom: {
						controls: true,
						wheel: false,
						startScale: 1.0,
						maxScale: 1.5,
						minScale: 0.2
					}
				}
			);

			// Pass the reference to the method to call, don't execute it (`()`)
			window.addEventListener('resize', this.resizeWorkspace, false);

			// Initial resize
			this.resizeWorkspace()
			Blockly.svgResize(this.workspace);
		},

		blocksExtensions(settings) {
			var settings = this.settings
			var cfg = Object();

			// coderbot.cfg data (temp workaround, must be fetched from backend)
			var CODERBOT_MOV_FW_DEF_SPEED = settings.move_fw_speed;
			var CODERBOT_MOV_FW_DEF_ELAPSE = settings.move_fw_elapse; // to check
			var CODERBOT_MOV_TR_DEF_SPEED = settings.move_tr_speed;
			var CODERBOT_MOV_TR_DEF_ELAPSE = settings.move_tr_elapse; // to check
			var CODERBOT_PROG_MOVE_MOTION = false; // to check
			var CODERBOT_PROG_MOVE_MPU = false; // to check

			var CODERBOT_PROG_LEVEL = settings.prog_level;

			var CODERBOT_PROG_SCROLLBARS = true; // to check
			var CODERBOT_PROG_MAXBLOCKS = -1;
			var CODERBOT_PROG_SAVEONRUN = true; // to check
			var CODERBOT_CTRL_FW_SPEED = settings.ctrl_fw_speed;
			var CODERBOT_CTRL_FW_ELAPSE = settings.ctrl_fw_elapse;
			var CODERBOT_CTRL_TR_SPEED = settings.ctrl_tr_speed;
			var CODERBOT_CTRL_TR_ELAPSE = settings.ctrl_tr_elapse; // to check
			var CODERBOT_CTRL_COUNTER = true; // to check, never used
			var CODERBOT_CTRL_MOVE_MOTION = false; //t o check
			var CODERBOT_CTRL_MOVE_MPU = false; // to check
			var CODERBOT_CNN_MODEL_LIST = ""

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


			// blocks.js
			//  Extensions to Blockly's language and Python generator.

			/*
			This is here because it needs to reach the configurations from
			the part above, which will be fetched from remote.
			*/




			Blockly.HSV_SATURATION = .99;
			Blockly.HSV_VALUE = .99;

			const self = this

			var sbsPrefix

			if (this.experimental) {
				// Append "Command." to enable stepbystep
				sbsPrefix = "Command."
			} else {
				sbsPrefix = ""
			}

			Blockly.Blocks['coderbot_repeat'] = {
				/**
				 * Block for repeat n times (internal number).
				 * @this Blockly.Block
				 */
				init: function(self) {

					this.setHelpUrl(Blockly.Msg.CONTROLS_REPEAT_HELPURL);
					this.setColour(120);
					var di = this.appendDummyInput();
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/loop_repeat.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CONTROLS_REPEAT_TITLE_REPEAT)
					}
					di.appendField(new Blockly.FieldTextInput('10',
						Blockly.FieldTextInput.nonnegativeIntegerValidator), 'TIMES');
					if (CODERBOT_PROG_LEVEL.indexOf("basic") < 0) {
						di.appendField(Blockly.Msg.CONTROLS_REPEAT_TITLE_TIMES);
					}
					var si = this.appendStatementInput('DO');
					if (CODERBOT_PROG_LEVEL.indexOf("basic") < 0) {
						si.appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(Blockly.Msg.CONTROLS_REPEAT_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_repeat'] = function(block) {
				// Repeat n times (internal number).
				var repeats = parseInt(block.getFieldValue('TIMES'), 10);
				var branch = Blockly.Python.statementToCode(block, 'DO');
				branch = Blockly.Python.addLoopTrap(branch, block.id) ||
					Blockly.Python.LOOP_PASS;
				var loopVar = Blockly.Python.variableDB_.getDistinctName(
					'count', Blockly.Variables.NAME_TYPE);
				var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
				return code;
			};

			Blockly.Python['text_print'] = function(block) {
				// Print statement.
				var argument0 = Blockly.Python.valueToCode(block, 'TEXT',
					Blockly.Python.ORDER_NONE) || '\'\'';
				return sbsPrefix + 'get_cam().set_text(' + argument0 + ')\n';
			};


			Blockly.Blocks['coderbot_moveForward'] = {
				// Block for moving forward.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
					this.setColour(40);
					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/move_forward.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_MOVE_FORWARD)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip('CoderBot_moveForwardTooltip');
				}
			};


			Blockly.Python['coderbot_moveForward'] = function(block) {
				// Generate Python for moving forward.
				if (CODERBOT_PROG_MOVE_MOTION) {
					return sbsPrefix + 'get_motion().move(dist=' + CODERBOT_MOV_FW_DEF_ELAPSE + ')\n';

				} else {
					return sbsPrefix + 'get_bot().forward(speed=' + CODERBOT_MOV_FW_DEF_SPEED + ', elapse=' + CODERBOT_MOV_FW_DEF_ELAPSE + ')\n';
				}
			};

			Blockly.Blocks['coderbot_moveBackward'] = {
				// Block for moving forward.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
					this.setColour(40);
					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/move_backward.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_MOVE_BACKWARD)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip('CoderBot_moveBackwardTooltip');
				}
			};

			Blockly.Python['coderbot_moveBackward'] = function(block) {
				// Generate Python for moving forward.
				if (CODERBOT_PROG_MOVE_MOTION) {
					return sbsPrefix + 'get_motion().move(dist=' + (-CODERBOT_MOV_FW_DEF_ELAPSE) + ')\n';

				} else {
					return sbsPrefix + 'get_bot().backward(speed=' + CODERBOT_MOV_FW_DEF_SPEED + ', elapse=' + CODERBOT_MOV_FW_DEF_ELAPSE + ')\n';
				}
			};

			Blockly.Blocks['coderbot_turnLeft'] = {
				// Block for turning left.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
					this.setColour(40);
					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/move_left.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_MOVE_LEFT);
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_turnTooltip'));
				}
			};

			Blockly.Python['coderbot_turnLeft'] = function(block) {
				// Generate Python for turning left.
				if (CODERBOT_PROG_MOVE_MOTION) {
					return sbsPrefix + 'get_motion().turn(angle=' + (-CODERBOT_MOV_TR_DEF_ELAPSE) + ')\n';
				} else if (CODERBOT_PROG_MOVE_MPU) {
					return sbsPrefix + 'get_bot().turn_angle(speed=' + (-CODERBOT_MOV_TR_DEF_SPEED) + ', angle=' + CODERBOT_MOV_TR_DEF_ELAPSE + ')\n';
				} else {
					return sbsPrefix + 'get_bot().left(speed=' + CODERBOT_MOV_TR_DEF_SPEED + ', elapse=' + CODERBOT_MOV_TR_DEF_ELAPSE + ')\n';
				}
			};

			Blockly.Blocks['coderbot_turnRight'] = {
				// Block for turning right.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
					this.setColour(40);
					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/move_right.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_MOVE_RIGHT)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_turnTooltip'));
				}
			};

			Blockly.Python['coderbot_turnRight'] = function(block) {
				// Generate Python for turning left or right.
				if (CODERBOT_PROG_MOVE_MOTION) {
					return sbsPrefix + 'get_motion().turn(angle=' + CODERBOT_MOV_TR_DEF_ELAPSE + ')\n';
				} else if (CODERBOT_PROG_MOVE_MPU) {
					return sbsPrefix + 'get_bot().turn_angle(speed=' + CODERBOT_MOV_TR_DEF_SPEED + ', angle=' + CODERBOT_MOV_TR_DEF_ELAPSE + ')\n';
				} else {
					return sbsPrefix + 'get_bot().right(speed=' + CODERBOT_MOV_TR_DEF_SPEED + ', elapse=' + CODERBOT_MOV_TR_DEF_ELAPSE + ')\n';
				}
			};

			Blockly.Blocks['coderbot_audio_say'] = {
				// Block for text to speech.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Say');
					this.setColour(220);
					var vi = this.appendValueInput('TEXT');
					vi.setCheck(["String", "Number", "Date"]);
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						vi.appendField(new Blockly.FieldImage('/static/images/blocks/say.png', 32, 32, '*'));
					} else {
						vi.appendField(Blockly.Msg.CODERBOT_SAY);
					}
					vi.appendField(new Blockly.FieldDropdown([
						[Blockly.Msg.CODERBOT_LOCALE_EN, 'en'],
						[Blockly.Msg.CODERBOT_LOCALE_IT, 'it'],
						[Blockly.Msg.CODERBOT_LOCALE_FR, 'fr'],
						[Blockly.Msg.CODERBOT_LOCALE_ES, 'es']
					]), 'LOCALE')

					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_sayTooltip'));
				}
			};

			Blockly.Python['coderbot_audio_say'] = function(block) {
				// Generate Python for turning left or right.
				var text = Blockly.Python.valueToCode(block, 'TEXT',
					Blockly.Python.ORDER_NONE) || '\'\'';
				var locale = block.getFieldValue('LOCALE');
				return sbsPrefix + 'get_audio().say(' + text + ', locale="' + locale + '")\n';
			};

			Blockly.Blocks['coderbot_sleep'] = {
				// Block for text to sleep.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Sleep');
					this.setColour(290);
					this.appendValueInput('ELAPSE')
						.setCheck(["Number"])
						.appendField(Blockly.Msg.CODERBOT_SLEEP);
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_sleepTooltip'));
				}
			};

			Blockly.Python['coderbot_sleep'] = function(block) {
				// Generate Python for sleeping.
				var elapse = Blockly.Python.valueToCode(block, 'ELAPSE',
					Blockly.Python.ORDER_NONE) || '\'\'';
				return sbsPrefix + 'get_bot().sleep(' + elapse + ')\n';
			};

			Blockly.Blocks['coderbot_adv_move'] = {
				// Block for moving forward.
				init: function() {
					var ACTIONS = [
						[Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD, 'FORWARD'],
						[Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD, 'BACKWARD'],
						[Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT, 'LEFT'],
						[Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT, 'RIGHT']
					]
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
					this.setColour(40);

					this.appendDummyInput("ACTION")
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOVE)
						.appendField(new Blockly.FieldDropdown(ACTIONS), 'ACTION');
					this.appendValueInput('SPEED')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_SPEED);
					this.appendValueInput('ELAPSE')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_ELAPSE);
					this.setInputsInline(true);
					// Assign 'this' to a variable for use in the tooltip closure below.
					var thisBlock = this;
					this.setTooltip(function() {
						var mode = thisBlock.getFieldValue('ACTION');
						var TOOLTIPS = {
							FORWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD,
							BACKWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD,
							LEFT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT,
							RIGHT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT,
						};
						return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
					});
					this.setPreviousStatement(true);
					this.setNextStatement(true);
				}
			};

			Blockly.Python['coderbot_adv_move'] = function(block) {
				// Generate Python for moving forward.
				var OPERATORS = {
					FORWARD: ['forward'],
					BACKWARD: ['backward'],
					LEFT: ['left'],
					RIGHT: ['right']
				};
				var tuple = OPERATORS[block.getFieldValue('ACTION')];
				var action = tuple[0];
				var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE);
				var elapse = Blockly.Python.valueToCode(block, 'ELAPSE', Blockly.Python.ORDER_NONE);
				var code = sbsPrefix + "get_bot()." + action + "(speed=" + speed + ", elapse=" + elapse + ")\n";
				return code;
			};

			Blockly.Blocks['coderbot_motion_move'] = {
				// Block for moving forward.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
					this.setColour(40);

					this.appendValueInput('DIST')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_MOTION_MOVE + " " + Blockly.Msg.CODERBOT_MOVE_MOTION_DIST);
					this.setInputsInline(true);
					// Assign 'this' to a variable for use in the tooltip closure below.
					var thisBlock = this;
					this.setTooltip(function() {
						return Blockly.Msg.CODERBOT_MOVE_MOTION_MOVE_TIP;
					});
					this.setPreviousStatement(true);
					this.setNextStatement(true);
				}
			};

			Blockly.Python['coderbot_motion_move'] = function(block) {
				// Generate Python for moving forward.
				var dist = Blockly.Python.valueToCode(block, 'DIST', Blockly.Python.ORDER_NONE);
				var code = sbsPrefix + "get_motion().move(dist=" + dist + ")\n";
				return code;
			};

			Blockly.Blocks['coderbot_motion_turn'] = {
				// Block for moving forward.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
					this.setColour(40);

					this.appendValueInput('ANGLE')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_MOTION_TURN + " " + Blockly.Msg.CODERBOT_MOVE_MOTION_ANGLE);
					this.setInputsInline(true);
					// Assign 'this' to a variable for use in the tooltip closure below.
					var thisBlock = this;
					this.setTooltip(function() {
						return Blockly.Msg.CODERBOT_MOVE_MOTION_TURN_TIP;
					});
					this.setPreviousStatement(true);
					this.setNextStatement(true);
				}
			};

			Blockly.Python['coderbot_motion_turn'] = function(block) {
				// Generate Python for moving forward.
				var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_NONE);
				var code = sbsPrefix + "get_motion().turn(angle=" + angle + ")\n";
				return code;
			};

			Blockly.Blocks['coderbot_adv_motor'] = {
				// Block for moving forward.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Motor');
					this.setColour(40);

					this.appendValueInput('SPEED_LEFT')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR + " " + Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_SPEED_LEFT);
					this.appendValueInput('SPEED_RIGHT')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_SPEED_RIGHT);
					this.appendValueInput('ELAPSE')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_ELAPSE);
					this.appendValueInput('STEPS_LEFT')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_STEPS_LEFT);
					this.appendValueInput('STEPS_RIGHT')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_STEPS_RIGHT);
					this.setInputsInline(true);
					// Assign 'this' to a variable for use in the tooltip closure below.
					var thisBlock = this;
					this.setTooltip(function() {
						var mode = thisBlock.getFieldValue('ACTION');
						return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
					});
					this.setPreviousStatement(true);
					this.setNextStatement(true);
				}
			};

			Blockly.Python['coderbot_adv_motor'] = function(block) {
				// Generate Python for moving forward.
				var speed_left = Blockly.Python.valueToCode(block, 'SPEED_LEFT', Blockly.Python.ORDER_NONE);
				var speed_right = Blockly.Python.valueToCode(block, 'SPEED_RIGHT', Blockly.Python.ORDER_NONE);
				var elapse = Blockly.Python.valueToCode(block, 'ELAPSE', Blockly.Python.ORDER_NONE);
				var steps_left = Blockly.Python.valueToCode(block, 'STEPS_LEFT', Blockly.Python.ORDER_NONE);
				var steps_right = Blockly.Python.valueToCode(block, 'STEPS_RIGHT', Blockly.Python.ORDER_NONE);
				var code = sbsPrefix + "get_bot().motor_control(speed_left=" + speed_left + ", speed_right=" + speed_right + ", elapse=" + elapse + ", steps_left=" + steps_left + ", steps_right=" + steps_right + ")\n";
				return code;
			};

			Blockly.Blocks['coderbot_adv_stop'] = {
				// Block to stop the get_bot().
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Stop');
					this.setColour(40);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_MOVE_STOP);
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_stopTooltip'));
				}
			};

			Blockly.Python['coderbot_adv_stop'] = function(block) {
				// Generate Python to stop the get_bot().
				return sbsPrefix + 'get_bot().stop()\n';
			};


			Blockly.Blocks['coderbot_camera_photoTake'] = {
				// Block for taking a picture.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
					this.setColour(120);
					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/photo_take.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_PHOTO_TAKE)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_PhotoTooltip'));
				}
			};

			Blockly.Python['coderbot_camera_photoTake'] = function(block) {
				// Generate Python for turning left or right.
				return sbsPrefix + 'get_cam().photo_take()\n';
			};

			Blockly.Blocks['coderbot_camera_videoRec'] = {
				// Block for recording a video (start).
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
					this.setColour(120);

					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/video_rec.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_VIDEO_REC)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_VideoTooltip'));
				}
			};

			Blockly.Python['coderbot_camera_videoRec'] = function(block) {
				// Generate Python for turning left or right.
				return sbsPrefix + 'get_cam().video_rec()\n';
			};

			Blockly.Blocks['coderbot_camera_videoStop'] = {
				// Block for recording a video (stop).
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
					this.setColour(120);

					var di = this.appendDummyInput()
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						di.appendField(new Blockly.FieldImage('/static/images/blocks/video_stop.png', 32, 32, '*'));
					} else {
						di.appendField(Blockly.Msg.CODERBOT_VIDEO_STOP)
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_VideoTooltip'));
				}
			};

			Blockly.Python['coderbot_camera_videoStop'] = function(block) {
				// Generate Python for turning left or right.
				return sbsPrefix + 'get_cam().video_stop()\n';
			};

			Blockly.Blocks['coderbot_adv_pathAhead'] = {
				/**
				 * Block for pathAhead function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_PATHAHEAD);
					this.setOutput(true, 'Number');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_pathAhead'] = function(block) {
				// Boolean values true and false.
				var code = sbsPrefix + 'get_cam().path_ahead()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findLine'] = {
				/**
				 * Block for pathAhead function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDLINE);
					this.setOutput(true, 'Array');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findLine'] = function(block) {
				// Boolean values true and false.
				var code = sbsPrefix + 'get_cam().find_line()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findSignal'] = {
				/**
				 * Block for findSignal function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDSIGNAL);
					this.setOutput(true, 'Number');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findSignal'] = function(block) {
				// Boolean values true and false.
				var code = sbsPrefix + 'get_cam().find_signal()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findFace'] = {
				/**
				 * Block for findSignal function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDFACE)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_SENSOR_FINDFACE_X, 'X'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDFACE_Y, 'Y'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDFACE_SIZE, 'SIZE'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDFACE_ALL, 'ALL']
						]), 'RETVAL')
					this.setInputsInline(true);
					this.setOutput(true, ['Number', 'Array']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findFace'] = function(block) {
				// Boolean values true and false.
				var retval = block.getFieldValue('RETVAL');
				var ret_code = { 'X': '[0]', 'Y': '[1]', 'SIZE': '[2]', 'ALL': '' } [retval];
				var code = 'get_cam().find_face()' + ret_code;
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findColor'] = {
				/**
				 * Block for findSignal function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_FIND)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_DIST, 'DIST'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_ANGLE, 'ANGLE'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_BOTH, 'BOTH']
						]), 'RETVAL')
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_COLOR);
					this.appendValueInput('COLOR')
						.setCheck(['Colour', 'String']);
					this.setInputsInline(true);
					this.setOutput(true, ['Number', 'Array']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findColor'] = function(block) {
				// Boolean values true and false.
				var color = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_NONE);
				var retval = block.getFieldValue('RETVAL');
				var ret_code = { 'DIST': '[0]', 'ANGLE': '[1]', 'BOTH': '' } [retval];
				var code = 'get_cam().find_color(' + color + ')' + ret_code;
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_cam_average'] = {
				/**
				 * Block for image.get_average() function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_AVERAGE)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_SENSOR_AVERAGE_HUE, 'H'],
							[Blockly.Msg.CODERBOT_SENSOR_AVERAGE_SATURATION, 'S'],
							[Blockly.Msg.CODERBOT_SENSOR_AVERAGE_VALUE, 'V'],
							[Blockly.Msg.CODERBOT_SENSOR_AVERAGE_ALL, 'ALL']
						]), 'RETVAL')
					this.setInputsInline(true);
					this.setOutput(true, ['Number', 'Array']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_cam_average'] = function(block) {
				// Boolean values true and false.
				var retval = block.getFieldValue('RETVAL');
				var ret_code = { 'H': '[0]', 'S': '[1]', 'V': '[2]', 'ALL': '' } [retval];
				var code = 'get_cam().get_average()' + ret_code;
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findText'] = {
				/**
				 * Block for findText function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_FIND)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_ALPHA, 'alpha'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_NUM, 'num'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_ALPHANUM, 'alphanum'],
							[Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_UNSPEC, 'unspec']
						]), 'ACCEPT')
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_COLOR);
					this.appendValueInput('COLOR')
						.setCheck(['Colour', 'String']);
					this.setInputsInline(true);
					this.setOutput(true, ['Number', 'Array']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findText'] = function(block) {
				// Boolean values true and false.
				var accept = block.getFieldValue('ACCEPT');
				var color = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_NONE);
				var code = 'get_cam().find_text(accept="' + accept + '", back_color=' + color + ')';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findQRCode'] = {
				/**
				 * Block for findText function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDQRCODE);
					this.setOutput(true, 'String');
					this.setInputsInline(true);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findQRCode'] = function(block) {
				// Boolean values true and false.
				var code = 'get_cam().find_qr_code()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findARCode'] = {
				/**
				 * Block for findText function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDARCODE);
					this.setOutput(true, 'HashMap');
					this.setInputsInline(true);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findARCode'] = function(block) {
				// Boolean values true and false.
				var code = 'get_cam().find_ar_code()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_findLogo'] = {
				/**
				 * Block for findLogo function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDLOGO);
					this.setOutput(true, 'Number');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_findLogo'] = function(block) {
				// Boolean values true and false.
				var code = 'get_cam().find_logo()';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_find_class'] = {
				/**
				 * Block for find_class function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCLASS);
					this.setOutput(true, 'String');
					this.setInputsInline(true);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_find_class'] = function(block) {
				// Boolean values true and false.
				var name = 'get_cam().find_class()';
				return [name, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_adv_cnn_classify'] = {
				/**
				 * Block for find_class function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCLASS)
						.appendField(new Blockly.FieldDropdown(CODERBOT_CNN_MODEL_LIST), 'MODEL');
					this.setInputsInline(true);
					this.setOutput(true, ['Array']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_adv_cnn_classify'] = function(block) {
				var model = block.getFieldValue('MODEL');
				var class_scores = 'get_cam().cnn_classify("' + model + '")';
				return [class_scores, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_event_generator'] = {
				init: function() {
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_EVENT_GENERATOR);
					this.appendStatementInput("generator_statements")
						.setCheck(null);
					this.setColour(15);
					this.setTooltip("event generator");
					this.setHelpUrl("");
				}
			};

			var coderbot_generator_id = 1;
			Blockly.Python['coderbot_event_generator'] = function(block) {
				Blockly.Generator.prototype.INDENT = '    ';
				var statements_event_generator = Blockly.Python.statementToCode(block, 'generator_statements');
				Blockly.Generator.prototype.INDENT = '  ';
				var code = 'def event_generator_' + coderbot_generator_id + '():\n' +
					'  while True:\n' +
					'    get_prog_eng().check_end()\n' +
					statements_event_generator + '\n' +
					'get_event().register_event_generator(event_generator_' + coderbot_generator_id + ')'
				coderbot_generator_id++;
				return code;
			};

			Blockly.Blocks['coderbot_event_listener'] = {
				init: function() {
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_EVENT_WHEN)
						.appendField(new Blockly.FieldTextInput("event_topic"), "event_topic")
						.appendField(Blockly.Msg.CODERBOT_EVENT_WITH + " event_data");
					this.appendStatementInput("event_statements")
						.setCheck(null);
					this.setInputsInline(true);
					this.setColour(15);
					this.setTooltip("");
					this.setHelpUrl("");
				}
			};

			var coderbot_listener_id = 1;
			Blockly.Python['coderbot_event_listener'] = function(block) {
				var event_topic = block.getFieldValue('event_topic');
				var event_statements = Blockly.Python.statementToCode(block, 'event_statements');
				var code = 'def event_listener_' + coderbot_listener_id + '(message):\n' +
					Blockly.Generator.prototype.INDENT + 'event_data = json.loads(message)\n' +
					event_statements + '\n' +
					'get_event().register_event_listener(\'' + event_topic + '\', event_listener_' + coderbot_listener_id + ')'
				coderbot_listener_id++;
				return code;
			};

			Blockly.Blocks['coderbot_event_publisher'] = {
				init: function() {
					this.appendValueInput("event_data")
						.appendField(Blockly.Msg.CODERBOT_EVENT_PUBLISH)
						.setCheck(null);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_EVENT_ON_TOPIC)
						.appendField(new Blockly.FieldTextInput("event_topic"), "event_topic");
					this.setInputsInline(true);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setColour(15);
					this.setTooltip("event publisher");
					this.setHelpUrl("");
				}
			};

			Blockly.Python['coderbot_event_publisher'] = function(block) {
				var event_topic = block.getFieldValue('event_topic');
				var event_data = Blockly.Python.valueToCode(block, 'event_data', Blockly.Python.ORDER_ATOMIC);
				var code = 'get_event().publish(\'' + event_topic + '\', json.dumps(' + event_data + '))\n';
				return code;
			};

			Blockly.Blocks['hashmap_get_value'] = {
				init: function() {
					this.appendValueInput("key")
						.setCheck("String")
						.appendField("get");
					this.appendValueInput("map")
						.setCheck("HashMap")
						.appendField("from ");
					this.setInputsInline(true);
					this.setOutput(true, null);
					this.setColour(230);
					this.setTooltip("get an item from an hashmap");
					this.setHelpUrl("");
				}
			};

			Blockly.Python['hashmap_get_value'] = function(block) {
				var value_key = Blockly.Python.valueToCode(block, 'key', Blockly.Python.ORDER_ATOMIC);
				var value_map = Blockly.Python.valueToCode(block, 'map', Blockly.Python.ORDER_ATOMIC);
				var code = value_map + '.get(' + value_key + ')';
				return [code, Blockly.Python.ORDER_NONE];
			};

			Blockly.Blocks['hashmap_get_keys'] = {
				init: function() {
					this.appendDummyInput()
						.appendField("get keys");
					this.appendValueInput("map")
						.setCheck("HashMap")
						.appendField("from ");
					this.setInputsInline(true);
					this.setOutput(true, "Array");
					this.setColour(230);
					this.setTooltip("get keys from an hashmap");
					this.setHelpUrl("");
				}
			};

			Blockly.Python['hashmap_get_keys'] = function(block) {
				var value_map = Blockly.Python.valueToCode(block, 'map', Blockly.Python.ORDER_ATOMIC);
				var code = value_map + '.keys()';
				return [code, Blockly.Python.ORDER_NONE];
			};


			Blockly.Blocks['coderbot_conv_get_action'] = {
				init: function() {
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_CONVERSATION_PARSE);
					this.appendValueInput("query")
						.setCheck("String");
					this.appendDummyInput()
						.appendField("in")
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_LOCALE_EN, 'en'],
							[Blockly.Msg.CODERBOT_LOCALE_IT, 'it'],
							[Blockly.Msg.CODERBOT_LOCALE_FR, 'fr'],
							[Blockly.Msg.CODERBOT_LOCALE_ES, 'es']
						]), "locale");
					this.setInputsInline(true);
					this.setOutput(true, "HashMap");
					this.setColour(230);
					this.setTooltip("");
					this.setHelpUrl("");
				}
			};

			Blockly.Python['coderbot_conv_get_action'] = function(block) {
				var value_query = Blockly.Python.valueToCode(block, 'query', Blockly.Python.ORDER_ATOMIC);
				var dropdown_locale = block.getFieldValue('locale');
				var code = 'get_conv().get_action(query=' + value_query + ', locale=\'' + dropdown_locale + '\')';
				return [code, Blockly.Python.ORDER_NONE];
			};

			Blockly.Blocks['coderbot_audio_record'] = {
				/**
				 * Block for findLogo function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(220);
					this.appendValueInput('FILENAME')
						.setCheck('String')
						.appendField(Blockly.Msg.CODERBOT_AUDIO_RECORD_FILE_NAME);
					this.appendValueInput('ELAPSE')
						.setCheck('Number')
						.appendField(Blockly.Msg.CODERBOT_AUDIO_RECORD_FILE_ELAPSE);
					this.setInputsInline(true);
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_audio_record_Tooltip'));
				}
			};

			Blockly.Python['coderbot_audio_record'] = function(block) {

				var filename = Blockly.Python.valueToCode(block, 'FILENAME',
					Blockly.Python.ORDER_NONE) || '\'\'';
				var elapse = Blockly.Python.valueToCode(block, 'ELAPSE',
					Blockly.Python.ORDER_NONE) || '\'\'';
				var code = 'get_audio().record_to_file(filename=' + filename + ', elapse=' + elapse + ')\n';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_audio_play'] = {
				// Block for text to speech.
				init: function() {
					this.setHelpUrl('http://code.google.com/p/blockly/wiki/Play');
					this.setColour(220);
					var vi = this.appendValueInput('FILENAME');
					vi.setCheck("String");
					if (CODERBOT_PROG_LEVEL.indexOf("basic") >= 0) {
						vi.appendField(new Blockly.FieldImage('/static/images/blocks/play.png', 32, 32, '*'));
					} else {
						vi.appendField(Blockly.Msg.CODERBOT_AUDIO_PLAY_FILE);
					}
					this.setPreviousStatement(true);
					this.setNextStatement(true);
					this.setTooltip(('CoderBot_audio_play_Tooltip'));
				}
			};

			Blockly.Python['coderbot_audio_play'] = function(block) {
				// Generate Python for turning left or right.
				var filename = Blockly.Python.valueToCode(block, 'FILENAME',
					Blockly.Python.ORDER_NONE) || '\'\'';
				return 'get_audio().play(' + filename + ')\n';
			};

			Blockly.Blocks['coderbot_audio_hear'] = {
				/**
				 * Block for audio hear function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(220);
					this.appendValueInput('LEVEL')
						.setCheck(["Number"])
						.appendField(Blockly.Msg.CODERBOT_AUDIO_HEAR + Blockly.Msg.CODERBOT_AUDIO_HEAR_LEVEL);
					this.appendValueInput('ELAPSE')
						.setCheck(["Number"])
						.appendField(Blockly.Msg.CODERBOT_AUDIO_HEAR_ELAPSE);
					this.setInputsInline(true);
					this.setOutput(true, ['Number']);
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_audio_hear'] = function(block) {
				// Boolean values true and false.
				var level = Blockly.Python.valueToCode(block, 'LEVEL', Blockly.Python.ORDER_NONE) || '\'\'';
				var elapse = Blockly.Python.valueToCode(block, 'ELAPSE', Blockly.Python.ORDER_NONE) || '\'\'';
				var code = 'get_audio().hear(level=' + level + ', elapse=' + elapse + ')';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_audio_listen'] = {
				/**
				 * Block for findText function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(220);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_AUDIO_LISTEN)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_LOCALE_EN, 'en-US'],
							[Blockly.Msg.CODERBOT_LOCALE_IT, 'it-IT'],
							[Blockly.Msg.CODERBOT_LOCALE_FR, 'fr-FR'],
							[Blockly.Msg.CODERBOT_LOCALE_ES, 'es-ES']
						]), 'MODEL');
					this.setInputsInline(true);
					this.setOutput(true, 'String');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_audio_listen'] = function(block) {
				// Boolean values true and false.
				var model = block.getFieldValue('MODEL');
				var code = sbsPrefix + 'get_audio().speech_recog_google(locale=\'' + model + '\')';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};

			Blockly.Blocks['coderbot_sonar_get_distance'] = {
				/**
				 * Block for get_distance function.
				 * @this Blockly.Block
				 */
				init: function() {
					this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
					this.setColour(250);
					this.appendDummyInput()
						.appendField(Blockly.Msg.CODERBOT_SONAR_GET_DISTANCE)
						.appendField(new Blockly.FieldDropdown([
							[Blockly.Msg.CODERBOT_SONAR_SENSOR_1, "0"],
							[Blockly.Msg.CODERBOT_SONAR_SENSOR_2, "1"],
							[Blockly.Msg.CODERBOT_SONAR_SENSOR_3, "2"]
						]), 'SONAR');
					this.setOutput(true, 'Number');
					this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
				}
			};

			Blockly.Python['coderbot_sonar_get_distance'] = function(block) {
				// Boolean values true and false.
				var sonar = block.getFieldValue('SONAR');
				var code = sbsPrefix + 'get_bot().get_sonar_distance(' + sonar + ')';
				return [code, Blockly.Python.ORDER_ATOMIC];
			};
		},

		toggleSidebar() {
			let currentStatus = this.$store.getters.drawerStatus
			this.$store.commit('toggleDrawer', !currentStatus)
		},

		getProgramData() {
			// Build the program object
			let name = this.programName
			let workspace = this.workspace
			let xml_code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			let dom_code = Blockly.Xml.domToText(xml_code);
			let isDefault = this.isDefault

			window.LoopTrap = 1000;
			Blockly.Python.INFINITE_LOOP_TRAP = '  get_prog_eng().check_end()\n';
			let code = Blockly.Python.workspaceToCode(workspace);
			Blockly.Python.INFINITE_LOOP_TRAP = null;

			return { name: name, dom_code: dom_code, code: code, default: isDefault };
		},

		exportProgram() {
			// Create a blob object and simulate a click event starting the download
			let data = JSON.stringify(this.getProgramData())
			const blob = new Blob([data], { type: 'text/json' })
			const e = document.createEvent('MouseEvents')
			const a = document.createElement('a');
			a.download = this.programName + '.json' || 'noname.json'
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
			e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		},

		pickFile() {
			// Manually trigger the file dialog for the hidden file input form
			this.$refs.file.click()
		},

		importProgram(e) {
			// Once the file is selected, read it and populate the Blockly
			//  workspace with the contained program
			let workspace = this.workspace
			const files = e.target.files
			if (files[0] !== undefined) {
				let fileName = files[0].name
				if (fileName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader()
				fr.readAsText(files[0])
				fr.addEventListener('load', () => {
					let importedProgram = JSON.parse(fr.result)
					let xml = Blockly.Xml.textToDom(importedProgram["dom_code"]);
					Blockly.Xml.domToWorkspace(xml, workspace);
				})
			} else {
				console.log("Something went wrong importing")
			}
		},

		toggleSaveAs() {
			this.salva = true
			newProgramName = programName
		},

		saveProgramAs(e) {
			if (this.newProgramName != '') {
				if (this.isDefault == "True" && this.programName == this.newProgramName) {
					this.CannotOverwrite = true
					console.log("error")
				} else {
					this.defaultProgramName = this.programName
					this.programName = this.newProgramName
					this.newProgramName = ''
					this.saveProgram()
				}
			} else {
				this.unvalidName = true
			}
		},

		saveProgram() {
			if (this.programName != '') {
				let axios = this.$axios
				let CB = this.CB
				let overwrite = this.$data.overwrite
				console.log("save")
				console.log(overwrite)
				let data = this.getProgramData()
				axios.post(CB + '/saveProgram?overwrite=' + overwrite, {
						name: data.name,
						dom_code: data.dom_code,
						code: data.code,
						default: ''
					})
					.then(function(data) {
						if (data.data == "defaultOverwrite" || data.data == "askOverwrite") {
							if (data.data == "askOverwrite") {
								this.$data.overwriteDialog = true
							} else {
								this.$data.programName = this.$data.defaultProgramName
								this.$data.defaultProgramName = ''
								this.$data.CannotOverwrite = true
							}
						} else {
							this.$data.isDefault = ''
							this.$data.overwrite = 0
							console.log("salvato")
						}
					}.bind(this))
			} else {
				this.unvalidName = true
			}
		},

		loadProgramList() {
			// Get the list of available programs and populate the popup
			let axios = this.$axios
			let CB = this.$data.CB
			axios.get(CB + '/list')
				.then(function(response) {
					this.$data.carica = true,
						this.$data.programList = response.data;
				}.bind(this))
		},

		loadProgram(program) {
			let axios = this.$axios
			let CB = this.$data.CB
			let workspace = this.$data.workspace
			let isDefault = this.$data.isDefault
			this.$data.carica = false;
			this.$data.programName = program
			axios.get(CB + '/load', {
					params: {
						name: program,
					}
				})
				.then(function(data) {
					console.log(data)
					workspace.clear();
					var xml = Blockly.Xml.textToDom(data.data.dom_code);
					Blockly.Xml.domToWorkspace(xml, workspace);
					this.$data.isDefault = data.data.default
				}.bind(this))
		},

		deleteProgramDlg(program) {
			this.$data.newProgramName = program
			this.$data.del = true
		},

		deleteProgram(program) {
			console.log(program)
			if (this.$data.programName == program) {
				this.$data.programName = ''
				this.$data.code = ''
				this.$data.workspace.clear()
			}
			let axios = this.$axios
			let CB = this.$data.CB
			console.log("delete")
			axios.post(CB + '/delete', {
					name: program
				})
				.then(function() {
					console.log("deletato")
				})
		},

		pollStatus() {
			let axios = this.$axios
			let CB = this.CB
			let status = this.status
			axios.get(CB + '/status')
				.then(function(response) {
					// If the reconnection happened while in this component, send a notification
					if (this.status == 0 && response.status) {
						this.snackText = 'CoderBot è tornato online'
						this.snackbar = true
					}
					this.statusData = response.data
					this.status = response.status
				}.bind(this))
				.catch(function(error) {
					console.log(error);
					// If the disconnection happened while in this component, send a notification
					if (this.status) {
						this.snackText = 'CoderBot irrangiungibile'
						this.snackbar = true
					}
					this.status = 0
				}.bind(this))
		},

		resizeWorkspace() {
			// Compute the absolute coordinates and dimensions of blocklyArea.
			let element = this.$refs.blocklyArea;
			do {
				element = element.offsetParent;
			} while (element);

			const offsetWidth = this.$refs.blocklyArea.offsetWidth;
			this.$refs.blocklyDiv.style.width = `${offsetWidth}px`;
			const offsetHeight = this.$refs.blocklyArea.offsetHeight;
			this.$refs.blocklyDiv.style.height = `${offsetHeight}px`;
		},

		getProgramCode() {
			// Expose the program, as generated by Blockly
			if (this.experimental) {
				this.experimental = false;
				this.blocksExtensions(this.settings);
				this.experimental = true;
			}

			Blockly.Python.STATEMENT_PREFIX = null;
			Blockly.Python.addReservedWords();
			Blockly.Python.INFINITE_LOOP_TRAP = null;
			this.code = Blockly.Python.workspaceToCode(this.workspace);
			console.log(this.code)
			this.dialogCode = true

			if (this.experimental) {
				this.blocksExtensions(this.settings)
			}
		},

		runProgramExperimental() {
			if (this.status) {
				var xml_code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
				var dom_code = Blockly.Xml.domToText(xml_code);
				Blockly.Python.INFINITE_LOOP_TRAP = null;
				//Injecting custom code
				Blockly.Python.STATEMENT_PREFIX = 'if not is_execFull:\n data_coderbotStatus["prog_gen"]["status"] = "pause"\n saveStatus()\n signal.pause()\ndata_coderbotStatus["prog_gen"]["currentBlockId"] = str(%1)\nsaveStatus()\n';
				Blockly.Python.addReservedWords('#highlightBlock');
				var code_modified = Blockly.Python.workspaceToCode();

				axios.post(CB + '/exec2', {
					name: 'Hello, World',
					dom_code,
					code: code_modified,
					mode: this.execMode
				})

			}
		},

		runProgram() {
			if (this.status) {
				let axios = this.$axios
				let CB = this.CB
				// POST /program/save
				var xml_code = Blockly.Xml.workspaceToDom(this.workspace);
				var dom_code = Blockly.Xml.domToText(xml_code);
				window.LoopTrap = 1000;
				Blockly.Python.INFINITE_LOOP_TRAP = '  get_prog_eng().check_end()\n';
				var code = Blockly.Python.workspaceToCode(this.workspace);
				Blockly.Python.INFINITE_LOOP_TRAP = null;

				axios.post(CB + '/exec', {
						name: 'Hello, World!',
						dom_code,
						code
					})
					.then(function(response) {

						console.log(response);
					})
			} else {
				this.generalDialog = true;
				this.generalDialogTitle = 'Errore',
					this.generalDialogText = 'Il coderbot risulta offline, non puoi eseguire il programma.'
			}
		},

		runProgramLegacy() {
			if (this.status) {
				let axios = this.$axios
				let CB = this.CB
				let qs = this.$qs
				this.log = ""
				// POST /program/save
				var xml_code = Blockly.Xml.workspaceToDom(this.workspace);
				var dom_code = Blockly.Xml.domToText(xml_code);
				window.LoopTrap = 1000;
				Blockly.Python.INFINITE_LOOP_TRAP = '  get_prog_eng().check_end()\n';
				var code = Blockly.Python.workspaceToCode(this.workspace);
				Blockly.Python.INFINITE_LOOP_TRAP = null;

				var valuesAsString = qs.stringify({
					'name': 'Hello, World!',
					'dom_code': dom_code,
					'code': code,
				})

				axios.post(this.CBv1 + '/program/exec', valuesAsString)
					.then(function(response) {
						console.log(response)
						this.runtimeDialog = true;
						setTimeout(function() {
							this.updateExecStatus();
						}.bind(this), 1000)
					}.bind(this))

			}
		},

		run() {
			// Run program handler

			// Some decision logic here
			this.runProgramLegacy()
		},

		stopProgram() {
			console.log("Stopping")
			let axios = this.$axios
			axios.post(this.CBv1 + '/program/end')
		},

		updateExecStatus() {
			let axios = this.$axios
			console.log("Updating Execution status")
			axios.get(this.CBv1 + '/program/status')
				.then(function(response) {
					console.log(response.data)
					if (response.data.running) {
						// Check again in a second
						setTimeout(function() {
							this.updateExecStatus();
						}.bind(this), 1000)
						this.log = response.data.log
					} else {
						this.log = "Esecuzione conclusa"
					}
				}.bind(this))
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
