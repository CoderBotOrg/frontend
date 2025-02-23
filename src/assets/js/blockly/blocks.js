/**
 * CoderBot, a didactical, programmable robot
 * Copyright (C) 2014,2015  Roberto Previtera <info@coderbot.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python';
import {registerFieldColour, FieldColour} from '@blockly/field-colour';

registerFieldColour();

var Blockly_Python = pythonGenerator;

Blockly.utils.colour.setHsvSaturation(0.9);
Blockly.utils.colour.setHsvValue(0.7);

const sbsPrefix = '';

// Extensions to Blockly's language and Python generator.

Blockly.Blocks.CoderBotSettings = {};

import imgRepeat from '@/assets/images/blocks/loop_repeat.png';

Blockly.Blocks.coderbot_basic_repeat = {
  /**
   * Block for repeat n times (internal number).
   * @this Blockly.Block
   */
  init(self) {
    this.setHelpUrl(Blockly.Msg.CONTROLS_REPEAT_HELPURL);
    this.setColour(120);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgRepeat, 32, 32, '*'));
    di.appendField(new Blockly.FieldTextInput('10',
      Blockly.FieldTextInput.nonnegativeIntegerValidator), 'TIMES');
    const si = this.appendStatementInput('DO');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_REPEAT_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_basic_repeat"] = function (block) {
  // Repeat n times (internal number).
  const repeats = parseInt(block.getFieldValue('TIMES'), 10);
  let branch = Blockly_Python.statementToCode(block, 'DO');
  branch = Blockly_Python.addLoopTrap(branch, block.id) ||
    Blockly_Python.LOOP_PASS;
  const loopVar = Blockly_Python.variableDB_.getDistinctName(
    'count', Blockly.Variables.NAME_TYPE,
  );
  const code = `for ${loopVar} in range(${repeats}):\n${branch}`;
  return code;
};

import imgMoveFwd from '@/assets/images/blocks/move_forward.png';

Blockly.Blocks.coderbot_basic_moveForward = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgMoveFwd, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveForwardTooltip');
  },
};

Blockly_Python.forBlock["coderbot_basic_moveForward"] = function (block) {
  // Generate Python for moving forward.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().move(dist=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().forward(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
};

import imgMoveBack from '@/assets/images/blocks/move_backward.png';

Blockly.Blocks.coderbot_basic_moveBackward = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgMoveBack, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveBackwardTooltip');
  },
};

Blockly_Python.forBlock["coderbot_basic_moveBackward"] = function (block) {
  // Generate Python for moving forward.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().move(dist=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().backward(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
};

import imgMoveLeft from '@/assets/images/blocks/move_left.png';

Blockly.Blocks.coderbot_basic_turnLeft = {
  // Block for turning left.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgMoveLeft, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_basic_turnLeft"] = function (block) {
  // Generate Python for turning left.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().turn(angle=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU) {
    return `${sbsPrefix}get_bot().turn_angle(speed=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().left(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
};

import imgMoveRight from '@/assets/images/blocks/move_right.png';

Blockly.Blocks.coderbot_basic_turnRight = {
  // Block for turning right.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgMoveRight, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_basic_turnRight"] = function (block) {
  // Generate Python for turning left or right.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().turn(angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU) {
    return `${sbsPrefix}get_bot().turn_angle(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().right(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
};

Blockly.Blocks['coderbot_adv_move_enc'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Motor');
    this.setColour(40);
    
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR + " " + Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_SPEED);
    this.appendValueInput('DISTANCE')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_DISTANCE);
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

Blockly_Python['coderbot_adv_move_enc'] = function(block) {
  // Generate Python for moving forward.
  var speed = Blockly_Python.valueToCode(block, 'SPEED', Blockly_Python.ORDER_NONE);
  var distance = Blockly_Python.valueToCode(block, 'DISTANCE', Blockly_Python.ORDER_NONE);
  var code = "get_bot().move(speed=" + speed + ", distance=" + distance + ")\n";
  return code;
};

// servo
Blockly.Blocks['coderbot_move_servo'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Motor');
    this.setColour(40);

    this.appendDummyInput()
        .appendField(Blockly.Msg.CODERBOT_MOVE_SERVO)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.CODERBOT_MOVE_SERVO_1, "0"],
                                                [Blockly.Msg.CODERBOT_MOVE_SERVO_2, "1"]]), 'SERVO');
    this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_MOVE_SERVO_ANGLE);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('ACTION');
      return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_SERVO_TIP_TAIL;
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly_Python['coderbot_move_servo'] = function(block) {
  // Generate Python for servo control.
  var servo = block.getFieldValue('SERVO');
  var angle = Blockly_Python.valueToCode(block, 'ANGLE', Blockly_Python.ORDER_NONE);
  var code = "get_bot().servo(servo=" + servo + ", angle=" + angle + ")\n";
  return code;
};

import imgSay from '@/assets/images/blocks/say.png';

Blockly.Blocks.coderbot_basic_audio_say = {
  // Block for text to speech.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Say');
    this.setColour(220);
    const vi = this.appendValueInput('TEXT');
    vi.setCheck(['String', 'Number', 'Date']);
    vi.appendField(new Blockly.FieldImage(imgSay, 32, 32, '*'));
    vi.appendField(new Blockly.FieldDropdown([
      [Blockly.Msg.CODERBOT_LOCALE_EN, 'en'],
      [Blockly.Msg.CODERBOT_LOCALE_IT, 'it'],
      [Blockly.Msg.CODERBOT_LOCALE_FR, 'fr'],
      [Blockly.Msg.CODERBOT_LOCALE_ES, 'es'],
    ]), 'LOCALE');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_sayTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_basic_audio_say"] = function (block) {
  // Generate Python for turning left or right.
  const text = Blockly_Python.valueToCode(block, 'TEXT',
    Blockly_Python.ORDER_NONE) || '\'\'';
  const locale = block.getFieldValue('LOCALE');
  return `${sbsPrefix}get_audio().say(${text}, locale="${locale}")\n`;
};


Blockly.Blocks.coderbot_repeat = {
  /**
   * Block for repeat n times (internal number).
   * @this Blockly.Block
   */
  init(self) {
    this.setHelpUrl(Blockly.Msg.CONTROLS_REPEAT_HELPURL);
    this.setColour(120);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CONTROLS_REPEAT_TITLE_REPEAT);
    di.appendField(new Blockly.FieldTextInput('10',
      Blockly.FieldTextInput.nonnegativeIntegerValidator), 'TIMES');
    const si = this.appendStatementInput('DO');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_REPEAT_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_repeat"] = function (block) {
  // Repeat n times (internal number).
  const repeats = parseInt(block.getFieldValue('TIMES'), 10);
  let branch = Blockly_Python.statementToCode(block, 'DO');
  branch = Blockly_Python.addLoopTrap(branch, block.id) ||
    Blockly_Python.LOOP_PASS;
  const loopVar = Blockly_Python.variableDB_.getDistinctName(
    'count', Blockly.Variables.NAME_TYPE,
  );
  const code = `for ${loopVar} in range(${repeats}):\n${branch}`;
  return code;
};

Blockly_Python.forBlock["text_print"] = function (block) {
  // Print statement.
  const argument0 = Blockly_Python.valueToCode(block, 'TEXT',
    Blockly_Python.ORDER_NONE) || '\'\'';
  return `${sbsPrefix}get_cam().set_text(${argument0})\n`;
};

Blockly.Blocks.colour_picker = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new FieldColour('#ff4040', null, {
        }),
        'COLOUR',
      );
    this.setOutput(true, 'String');
  },
};

Blockly_Python.forBlock["colour_picker"] = function (block) {
  // Print statement.
  const colour = block.getFieldValue('COLOUR');
  const code = `"${colour}"`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};
Blockly.Blocks.coderbot_moveForward = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_MOVE_FORWARD);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveForwardTooltip');
  },
};

Blockly_Python.forBlock["coderbot_moveForward"] = function (block) {
  // Generate Python for moving forward.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().move(dist=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().forward(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
};

Blockly.Blocks.coderbot_moveBackward = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_MOVE_BACKWARD);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveBackwardTooltip');
  },
};

Blockly_Python.forBlock["coderbot_moveBackward"] = function (block) {
  // Generate Python for moving forward.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().move(dist=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().backward(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_FW_DEF_ELAPSE})\n`;
};

Blockly.Blocks.coderbot_turnLeft = {
  // Block for turning left.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_MOVE_LEFT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_turnLeft"] = function (block) {
  // Generate Python for turning left.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().turn(angle=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU) {
    return `${sbsPrefix}get_bot().turn_angle(speed=${-Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().left(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
};

Blockly.Blocks.coderbot_turnRight = {
  // Block for turning right.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(40);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_MOVE_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_turnRight"] = function (block) {
  // Generate Python for turning left or right.
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MOTION) {
    return `${sbsPrefix}get_motion().turn(angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  if (Blockly.Blocks.CoderBotSettings.CODERBOT_PROG_MOVE_MPU) {
    return `${sbsPrefix}get_bot().turn_angle(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, angle=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
  }
  return `${sbsPrefix}get_bot().right(speed=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_SPEED}, elapse=${Blockly.Blocks.CoderBotSettings.CODERBOT_MOV_TR_DEF_ELAPSE})\n`;
};

Blockly.Blocks.coderbot_audio_say = {
  // Block for text to speech.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Say');
    this.setColour(220);
    const vi = this.appendValueInput('TEXT');
    vi.setCheck(['String', 'Number', 'Date']);
    vi.appendField(Blockly.Msg.CODERBOT_SAY);
    vi.appendField(new Blockly.FieldDropdown([
      [Blockly.Msg.CODERBOT_LOCALE_EN, 'en'],
      [Blockly.Msg.CODERBOT_LOCALE_IT, 'it'],
      [Blockly.Msg.CODERBOT_LOCALE_FR, 'fr'],
      [Blockly.Msg.CODERBOT_LOCALE_ES, 'es'],
    ]), 'LOCALE');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_sayTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_audio_say"] = function (block) {
  // Generate Python for turning left or right.
  const text = Blockly_Python.valueToCode(block, 'TEXT',
    Blockly_Python.ORDER_NONE) || '\'\'';
  const locale = block.getFieldValue('LOCALE');
  return `${sbsPrefix}get_audio().say(${text}, locale="${locale}")\n`;
};

Blockly.Blocks.coderbot_sleep = {
  // Block for text to sleep.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Sleep');
    this.setColour(290);
    this.appendValueInput('ELAPSE')
      .setCheck(['Number'])
      .appendField(Blockly.Msg.CODERBOT_SLEEP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_sleepTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_sleep"] = function (block) {
  // Generate Python for sleeping.
  const elapse = Blockly_Python.valueToCode(block, 'ELAPSE',
    Blockly_Python.ORDER_NONE) || '\'\'';
  return `${sbsPrefix}get_bot().sleep(${elapse})\n`;
};

/** ENCODER METHODS * */
// muovi bot [direzione] a velocità [velcità] per [tempo]
Blockly.Blocks.coderbot_adv_move = {
  // Block for moving forward.
  init() {
    const ACTIONS = [
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD, 'FORWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD, 'BACKWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT, 'LEFT'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT, 'RIGHT'],
    ];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);

    this.appendDummyInput('ACTION')
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
    const thisBlock = this;
    this.setTooltip(() => {
      const mode = thisBlock.getFieldValue('ACTION');
      const TOOLTIPS = {
        FORWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD,
        BACKWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD,
        LEFT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT,
        RIGHT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT,
      };
      return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    if (Blockly.Blocks.CoderBotSettings.CODERBOT_ENCODER_AVAILABLE == false) {
      this.setDisabled(true);
    }
  },
};

Blockly_Python.forBlock["coderbot_adv_move"] = function (block) {
  // Generate Python for moving forward.
  const OPERATORS = {
    FORWARD: ['forward'],
    BACKWARD: ['backward'],
    LEFT: ['left'],
    RIGHT: ['right'],
  };
  const tuple = OPERATORS[block.getFieldValue('ACTION')];
  const action = tuple[0];
  const speed = Blockly_Python.valueToCode(block, 'SPEED', Blockly_Python.ORDER_NONE);
  const elapse = Blockly_Python.valueToCode(block, 'ELAPSE', Blockly_Python.ORDER_NONE);
  const code = `${sbsPrefix}get_bot().${action}(speed=${speed}, elapse=${elapse})\n`;
  return code;
};

// muovi bot [direzione] per [distanza] metri
Blockly.Blocks.coderbot_adv_move_distance = {
  // Block for moving forward.
  init() {
    const ACTIONS = [
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD, 'FORWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD, 'BACKWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT, 'LEFT'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT, 'RIGHT'],
    ];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);

    this.appendDummyInput('ACTION')
      .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOVE)
      .appendField(new Blockly.FieldDropdown(ACTIONS), 'ACTION');
    this.appendValueInput('DISTANCE')
      .setCheck('Number')
      .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_ELAPSE)
      .appendField(Blockly.Msg.MEASURE_UNIT);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(() => {
      const mode = thisBlock.getFieldValue('ACTION');
      const TOOLTIPS = {
        FORWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD,
        BACKWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD,
        LEFT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT,
        RIGHT: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT,
      };
      return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    if (Blockly.Blocks.CoderBotSettings.CODERBOT_ENCODER_AVAILABLE == false) {
      this.setDisabled(true);
    }
  },
};

Blockly_Python.forBlock["coderbot_adv_move_distance"] = function (block) {
  // Generate Python for moving forward.
  const OPERATORS = {
    FORWARD: ['forward'],
    BACKWARD: ['backward'],
    LEFT: ['left'],
    RIGHT: ['right'],
  };
  const tuple = OPERATORS[block.getFieldValue('ACTION')];
  const action = tuple[0];
  const speed = 100;
  const distance = Blockly_Python.valueToCode(block, 'DISTANCE', Blockly_Python.ORDER_NONE);
  let code = '';
  if(action == 'left') {
    code = `${sbsPrefix}get_bot().motor_control(speed_left=-${speed}, speed_right=${speed}, target_distance=${distance})\n`;
  } else if(action == 'right') {
    code = `${sbsPrefix}get_bot().motor_control(speed_left=${speed}, speed_right=-${speed}, target_distance=${distance})\n`;
  } else {
    code = `${sbsPrefix}get_bot().${action}(speed=${speed}, distance=${distance})\n`;
  }
  return code;
};

// muovi bot [direzione] a velocità [velocità] per [distanza] metri
Blockly.Blocks.coderbot_adv_move_speed_distance = {
  // Block for moving forward.
  init() {
    const ACTIONS = [
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD, 'FORWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD, 'BACKWARD'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_LEFT, 'LEFT'],
      [Blockly.Msg.CODERBOT_MOVE_ADV_TIP_RIGHT, 'RIGHT'],
    ];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);

    this.appendDummyInput('ACTION')
      .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_MOVE)
      .appendField(new Blockly.FieldDropdown(ACTIONS), 'ACTION');
    this.appendValueInput('SPEED')
      .setCheck('Number')
      .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_SPEED);
    this.appendValueInput('DISTANCE')
      .setCheck('Number')
      .appendField(Blockly.Msg.CODERBOT_MOVE_ADV_ELAPSE)
      .appendField(Blockly.Msg.MEASURE_UNIT);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(() => {
      const mode = thisBlock.getFieldValue('ACTION');
      const TOOLTIPS = {
        FORWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_FORWARD,
        BACKWARD: Blockly.Msg.CODERBOT_MOVE_ADV_TIP_BACKWARD,
      };
      return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};

Blockly_Python.forBlock["coderbot_adv_move_speed_distance"] = function (block) {
  // Generate Python for moving forward.
  const OPERATORS = {
    FORWARD: ['forward'],
    BACKWARD: ['backward'],
    LEFT: ['motor_control'],
    RIGHT: ['motor_control'],
  };
  const tuple = OPERATORS[block.getFieldValue('ACTION')];
  const action = tuple[0];
  const speed = Blockly_Python.valueToCode(block, 'SPEED', Blockly_Python.ORDER_NONE);
  const distance = Blockly_Python.valueToCode(block, 'DISTANCE', Blockly_Python.ORDER_NONE);
  let code = '';
  if(action == 'motor_control') {
    code = `${sbsPrefix}get_bot().motor_control(speed_left=${speed}, speed_right=-${speed}, target_distance=${distance})\n`;
  } else {
    code = `${sbsPrefix}get_bot().${action}(speed=${speed}, distance=${distance})\n`;
  }
  return code;
};

/** end of ENCODER METHODS * */

Blockly.Blocks.coderbot_motion_move = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);

    this.appendValueInput('DIST')
      .setCheck('Number')
      .appendField(`${Blockly.Msg.CODERBOT_MOVE_MOTION_MOVE} ${Blockly.Msg.CODERBOT_MOVE_MOTION_DIST}`);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(() => Blockly.Msg.CODERBOT_MOVE_MOTION_MOVE_TIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};

Blockly_Python.forBlock["coderbot_motion_move"] = function (block) {
  // Generate Python for moving forward.
  const dist = Blockly_Python.valueToCode(block, 'DIST', Blockly_Python.ORDER_NONE);
  const code = `${sbsPrefix}get_motion().move(dist=${dist})\n`;
  return code;
};

Blockly.Blocks.coderbot_motion_turn = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(40);

    this.appendValueInput('ANGLE')
      .setCheck('Number')
      .appendField(`${Blockly.Msg.CODERBOT_MOVE_MOTION_TURN} ${Blockly.Msg.CODERBOT_MOVE_MOTION_ANGLE}`);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(() => Blockly.Msg.CODERBOT_MOVE_MOTION_TURN_TIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};

Blockly_Python.forBlock["coderbot_motion_turn"] = function (block) {
  // Generate Python for moving forward.
  const angle = Blockly_Python.valueToCode(block, 'ANGLE', Blockly_Python.ORDER_NONE);
  const code = `${sbsPrefix}get_motion().turn(angle=${angle})\n`;
  return code;
};

Blockly.Blocks.coderbot_adv_motor = {
  // Block for moving forward.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Motor');
    this.setColour(40);

    this.appendValueInput('SPEED_LEFT')
      .setCheck('Number')
      .appendField(`${Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR} ${Blockly.Msg.CODERBOT_MOVE_ADV_MOTOR_SPEED_LEFT}`);
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
    const thisBlock = this;
    this.setTooltip(() => {
      const mode = thisBlock.getFieldValue('ACTION');
      return TOOLTIPS[mode] + Blockly.Msg.CODERBOT_MOVE_ADV_TIP_TAIL;
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};

Blockly_Python.forBlock["coderbot_adv_motor"] = function (block) {
  // Generate Python for moving forward.
  const speed_left = Blockly_Python.valueToCode(block, 'SPEED_LEFT', Blockly_Python.ORDER_NONE);
  const speed_right = Blockly_Python.valueToCode(block, 'SPEED_RIGHT', Blockly_Python.ORDER_NONE);
  const elapse = Blockly_Python.valueToCode(block, 'ELAPSE', Blockly_Python.ORDER_NONE);
  const steps_left = Blockly_Python.valueToCode(block, 'STEPS_LEFT', Blockly_Python.ORDER_NONE);
  const steps_right = Blockly_Python.valueToCode(block, 'STEPS_RIGHT', Blockly_Python.ORDER_NONE);
  const code = `${sbsPrefix}get_bot().motor_control(speed_left=${speed_left}, speed_right=${speed_right}, elapse=${elapse}, steps_left=${steps_left}, steps_right=${steps_right})\n`;
  return code;
};

Blockly.Blocks.coderbot_adv_stop = {
  // Block to stop the get_bot().
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Stop');
    this.setColour(40);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_MOVE_STOP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_stopTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_adv_stop"] = function (block) {
  // Generate Python to stop the get_bot().
  return `${sbsPrefix}get_bot().stop()\n`;
};

Blockly.Blocks.coderbot_camera_photoTake = {
  // Block for taking a picture.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);
    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_PHOTO_TAKE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_PhotoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_camera_photoTake"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().photo_take()\n`;
};

import imgPhotoTake from '@/assets/images/blocks/photo_take.png';

Blockly.Blocks.coderbot_basic_camera_photoTake = {
  // Block for taking a picture.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);
    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgPhotoTake, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_PhotoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_camera_basic_photoTake"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().photo_take()\n`;
};

Blockly.Blocks.coderbot_camera_videoRec = {
  // Block for recording a video (start).
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);

    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_VIDEO_REC);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_VideoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_camera_videoRec"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().video_rec()\n`;
};

import imgVideoRec from '@/assets/images/blocks/video_rec.png';

Blockly.Blocks.coderbot_basic_camera_videoRec = {
  // Block for recording a video (start).
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);

    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgVideoRec, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_VideoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_basic_camera_videoRec"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().video_rec()\n`;
};

Blockly.Blocks.coderbot_camera_videoStop = {
  // Block for recording a video (stop).
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);

    const di = this.appendDummyInput();
    di.appendField(Blockly.Msg.CODERBOT_VIDEO_STOP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_VideoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_camera_videoStop"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().video_stop()\n`;
};

import imgVideoStop from '@/assets/images/blocks/video_stop.png';

Blockly.Blocks.coderbot_basic_camera_videoStop = {
  // Block for recording a video (stop).
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(120);

    const di = this.appendDummyInput();
    di.appendField(new Blockly.FieldImage(imgVideoStop, 32, 32, '*'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_VideoTooltip'));
  },
};

Blockly_Python.forBlock["coderbot_basic_camera_videoStop"] = function (block) {
  // Generate Python for turning left or right.
  return `${sbsPrefix}get_cam().video_stop()\n`;
};

Blockly.Blocks.coderbot_adv_pathAhead = {
  /**
   * Block for pathAhead function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_PATHAHEAD);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_pathAhead"] = function (block) {
  // Boolean values true and false.
  const code = `${sbsPrefix}get_cam().path_ahead()`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findLine = {
  /**
   * Block for pathAhead function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDLINE);
    this.setOutput(true, 'Array');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findLine"] = function (block) {
  // Boolean values true and false.
  const code = `${sbsPrefix}get_cam().find_line()`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findFace = {
  /**
   * Block for findSignal function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDFACE)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_SENSOR_FINDFACE_X, 'X'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDFACE_Y, 'Y'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDFACE_SIZE, 'SIZE'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDFACE_ALL, 'ALL'],
      ]), 'RETVAL');
    this.setInputsInline(true);
    this.setOutput(true, ['Number', 'Array']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findFace"] = function (block) {
  // Boolean values true and false.
  const retval = block.getFieldValue('RETVAL');
  const ret_code = {
    X: '[0]',
    Y: '[1]',
    SIZE: '[2]',
    ALL: '',
  } [retval];
  const code = `get_cam().find_face()${ret_code}`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findColor = {
  /**
   * Block for findSignal function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_FIND)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_DIST, 'DIST'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_ANGLE, 'ANGLE'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_BOTH, 'BOTH'],
      ]), 'RETVAL')
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCOLOR_COLOR);
    this.appendValueInput('COLOR')
      .setCheck(['Colour', 'String']);
    this.setInputsInline(true);
    this.setOutput(true, ['Number', 'Array']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findColor"] = function (block) {
  // Boolean values true and false.
  const color = Blockly_Python.valueToCode(block, 'COLOR', Blockly_Python.ORDER_NONE);
  const retval = block.getFieldValue('RETVAL');
  const ret_code = {
    DIST: '[0]',
    ANGLE: '[1]',
    BOTH: ''
  } [retval];
  const code = `get_cam().find_color(${color})${ret_code}`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_cam_average = {
  /**
   * Block for image.get_average() function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_AVERAGE)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_SENSOR_AVERAGE_HUE, 'H'],
        [Blockly.Msg.CODERBOT_SENSOR_AVERAGE_SATURATION, 'S'],
        [Blockly.Msg.CODERBOT_SENSOR_AVERAGE_VALUE, 'V'],
        [Blockly.Msg.CODERBOT_SENSOR_AVERAGE_ALL, 'ALL'],
      ]), 'RETVAL');
    this.setInputsInline(true);
    this.setOutput(true, ['Number', 'Array']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_cam_average"] = function (block) {
  // Boolean values true and false.
  const retval = block.getFieldValue('RETVAL');
  const ret_code = {
    H: '[0]',
    S: '[1]',
    V: '[2]',
    ALL: '',
  } [retval];
  const code = `get_cam().get_average()${ret_code}`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findText = {
  /**
   * Block for findText function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_FIND)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_ENG, 'eng'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_ITA, 'ita'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_SPA, 'spa'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_FRE, 'fra'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_DEU, 'deu'],
        [Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_ACCEPT_UNSPEC, ''],
      ]), 'ACCEPT')
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDTEXT_TIMEOUT);
    this.appendValueInput('TIMEOUT')
      .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, ['String']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findText"] = function (block) {
  // Boolean values true and false.
  const lang = block.getFieldValue('ACCEPT');
  const timeout = Blockly_Python.valueToCode(block, 'TIMEOUT', Blockly_Python.ORDER_NONE);
  const code = `get_cam().find_text(lang="${lang}", timeout=${timeout})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findQRCode = {
  /**
   * Block for findText function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDQRCODE);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findQRCode"] = function (block) {
  // Boolean values true and false.
  const code = 'get_cam().find_qr_code()';
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_findARCode = {
  /**
   * Block for findText function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDARCODE);
    this.setOutput(true, 'HashMap');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_findARCode"] = function (block) {
  // Boolean values true and false.
  const code = 'get_cam().find_ar_code()';
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_find_class = {
  /**
   * Block for find_class function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCLASS);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_find_class"] = function (block) {
  // Boolean values true and false.
  const name = 'get_cam().find_class()';
  return [name, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_cnn_classify = {
  /**
   * Block for find_class function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDCLASS)
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.CODERBOT_CNN_MODEL_LIST), 'MODEL');
    this.setInputsInline(true);
    this.setOutput(true, ['Array']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_cnn_classify"] = function (block) {
  const model = block.getFieldValue('MODEL');
  const class_scores = `get_cam().cnn_classify("${model}")`;
  return [class_scores, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_adv_cnn_detect_objects = {
  /**
   * Block for find_class function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SENSOR_FINDOBJECTS)
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.CODERBOT_CNN_MODEL_LIST), 'MODEL');
    this.setInputsInline(true);
    this.setOutput(true, ['Array']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_adv_cnn_detect_objects"] = function (block) {
  const model = block.getFieldValue('MODEL');
  const class_scores = `get_cam().cnn_detect_objects("${model}")`;
  return [class_scores, Blockly_Python.ORDER_ATOMIC];
};
Blockly.Blocks.coderbot_event_generator = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_EVENT_GENERATOR);
    this.appendStatementInput('generator_statements')
      .setCheck(null);
    this.setColour(15);
    this.setTooltip('event generator');
    this.setHelpUrl('');
  },
};

let coderbot_generator_id = 1;
Blockly_Python.forBlock["coderbot_event_generator"] = function (block) {
  const INDENT_saved = Blockly_Python.INDENT;
  Blockly_Python.INDENT = Blockly_Python.INDENT + Blockly_Python.INDENT;
  const statements_event_generator = Blockly_Python.statementToCode(block, 'generator_statements');
  Blockly_Python.INDENT = INDENT_saved;
  const code = `def event_generator_${coderbot_generator_id}():\n${
    INDENT_saved}while True:\n${
    INDENT_saved}${INDENT_saved}get_prog_eng().check_end()\n${
    statements_event_generator}\n` +
    `get_event().register_event_generator(event_generator_${coderbot_generator_id})`;
  coderbot_generator_id++;
  return code;
};

Blockly.Blocks.coderbot_event_listener = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_EVENT_WHEN)
      .appendField(new Blockly.FieldTextInput('event_topic'), 'event_topic')
      .appendField(`${Blockly.Msg.CODERBOT_EVENT_WITH} event_data`);
    this.appendStatementInput('event_statements')
      .setCheck(null);
    this.setInputsInline(true);
    this.setColour(15);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

let coderbot_listener_id = 1;
Blockly_Python.forBlock["coderbot_event_listener"] = function (block) {
  const event_topic = block.getFieldValue('event_topic');
  const event_statements = Blockly_Python.statementToCode(block, 'event_statements');
  const code = `def event_listener_${coderbot_listener_id}(message):\n${
    Blockly_Python.INDENT}event_data = json.loads(message)\n${
    event_statements}\n` +
    `get_event().register_event_listener('${event_topic}', event_listener_${coderbot_listener_id})`;
  coderbot_listener_id++;
  return code;
};

Blockly.Blocks.coderbot_event_publisher = {
  init() {
    this.appendValueInput('event_data')
      .appendField(Blockly.Msg.CODERBOT_EVENT_PUBLISH)
      .setCheck(null);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_EVENT_ON_TOPIC)
      .appendField(new Blockly.FieldTextInput('event_topic'), 'event_topic');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(15);
    this.setTooltip('event publisher');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_event_publisher"] = function (block) {
  const event_topic = block.getFieldValue('event_topic');
  const event_data = Blockly_Python.valueToCode(block, 'event_data', Blockly_Python.ORDER_ATOMIC);
  const code = `get_event().publish('${event_topic}', json.dumps(${event_data}))\n`;
  return code;
};

Blockly.Blocks.hashmap_get_value = {
  init() {
    this.appendValueInput('key')
      .setCheck('String')
      .appendField('get');
    this.appendValueInput('map')
      .setCheck('HashMap')
      .appendField('from ');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('get an item from an hashmap');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["hashmap_get_value"] = function (block) {
  const value_key = Blockly_Python.valueToCode(block, 'key', Blockly_Python.ORDER_ATOMIC);
  const value_map = Blockly_Python.valueToCode(block, 'map', Blockly_Python.ORDER_ATOMIC);
  const code = `${value_map}.get(${value_key})`;
  return [code, Blockly_Python.ORDER_NONE];
};

Blockly.Blocks.hashmap_get_keys = {
  init() {
    this.appendDummyInput()
      .appendField('get keys');
    this.appendValueInput('map')
      .setCheck('HashMap')
      .appendField('from ');
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setColour(230);
    this.setTooltip('get keys from an hashmap');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["hashmap_get_keys"] = function (block) {
  const value_map = Blockly_Python.valueToCode(block, 'map', Blockly_Python.ORDER_ATOMIC);
  const code = `${value_map}.keys()`;
  return [code, Blockly_Python.ORDER_NONE];
};

Blockly.Blocks.coderbot_conv_get_action = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_CONVERSATION_PARSE);
    this.appendValueInput('query')
      .setCheck('String');
    this.appendDummyInput()
      .appendField('in')
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_LOCALE_EN, 'en'],
        [Blockly.Msg.CODERBOT_LOCALE_IT, 'it'],
        [Blockly.Msg.CODERBOT_LOCALE_FR, 'fr'],
        [Blockly.Msg.CODERBOT_LOCALE_ES, 'es'],
      ]), 'locale');
    this.setInputsInline(true);
    this.setOutput(true, 'HashMap');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_conv_get_action"] = function (block) {
  const value_query = Blockly_Python.valueToCode(block, 'query', Blockly_Python.ORDER_ATOMIC);
  const dropdown_locale = block.getFieldValue('locale');
  const code = `get_conv().get_action(query=${value_query}, locale='${dropdown_locale}')`;
  return [code, Blockly_Python.ORDER_NONE];
};

Blockly.Blocks.coderbot_audio_record = {
  /**
   * Block for findLogo function.
   * @this Blockly.Block
   */
  init() {
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
  },
};

Blockly_Python.forBlock["coderbot_audio_record"] = function (block) {
  const filename = Blockly_Python.valueToCode(block, 'FILENAME',
    Blockly_Python.ORDER_NONE) || '\'\'';
  const elapse = Blockly_Python.valueToCode(block, 'ELAPSE',
    Blockly_Python.ORDER_NONE) || '\'\'';
  const code = `get_audio().record_to_file(filename=${filename}, elapse=${elapse})\n`;
  return code;
};

Blockly.Blocks.coderbot_audio_play = {
  // Block for text to speech.
  init() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Play');
    this.setColour(220);
    const vi = this.appendValueInput('FILENAME');
    vi.setCheck('String');
    vi.appendField(Blockly.Msg.CODERBOT_AUDIO_PLAY_FILE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_audio_play_Tooltip'));
  },
};

Blockly_Python.forBlock["coderbot_audio_play"] = function (block) {
  // Generate Python for turning left or right.
  const filename = Blockly_Python.valueToCode(block, 'FILENAME',
    Blockly_Python.ORDER_NONE) || '\'\'';
  return `get_audio().play(${filename})\n`;
};

Blockly.Blocks.coderbot_audio_hear = {
  /**
   * Block for audio hear function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(220);
    this.appendValueInput('LEVEL')
      .setCheck(['Number'])
      .appendField(Blockly.Msg.CODERBOT_AUDIO_HEAR + Blockly.Msg.CODERBOT_AUDIO_HEAR_LEVEL);
    this.appendValueInput('ELAPSE')
      .setCheck(['Number'])
      .appendField(Blockly.Msg.CODERBOT_AUDIO_HEAR_ELAPSE);
    this.setInputsInline(true);
    this.setOutput(true, ['Boolean']);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_audio_hear"] = function (block) {
  // Boolean values true and false.
  const level = Blockly_Python.valueToCode(block, 'LEVEL', Blockly_Python.ORDER_NONE) || '\'\'';
  const elapse = Blockly_Python.valueToCode(block, 'ELAPSE', Blockly_Python.ORDER_NONE) || '\'\'';
  const code = `get_audio().hear(level=${level}, elapse=${elapse})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_audio_listen = {
  /**
   * Block for findText function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(220);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_AUDIO_LISTEN)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_LOCALE_EN, 'en-US'],
        [Blockly.Msg.CODERBOT_LOCALE_IT, 'it-IT'],
        [Blockly.Msg.CODERBOT_LOCALE_FR, 'fr-FR'],
        [Blockly.Msg.CODERBOT_LOCALE_ES, 'es-ES'],
      ]), 'MODEL');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

import imgMusicNote from '@/assets/images/blocks/musical_note.png';

Blockly.Blocks.coderbot_music_note_basic = {
  init() {
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField(new Blockly.FieldImage(imgMusicNote, 30, 30, {
        alt: 'note',
        flipRtl: 'FALSE'
      }))
      .appendField('NOTA')
      .appendField(new Blockly.FieldDropdown([
        ['DO', 'C2'],
        ['RE', 'D2'],
        ['MI', 'E2'],
        ['FA', 'F2'],
        ['SOL', 'G2'],
        ['LA', 'A3'],
        ['SI', 'B3'],
        ['DO+', 'C3'],
        ['RE+', 'D3']
      ]), 'NAME');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_note_basic"] = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const code = `get_music().play_note("${dropdown_name}")\n`;
  return code;
};

Blockly.Blocks.coderbot_animal_verse_basic = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(imgMusicAnimal, 30, 30, {
        alt: '*',
        flipRtl: 'FALSE'
      }))
      .appendField('Verso del')
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.animalist), 'Verso del');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Verso animale');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_animal_verse_basic"] = function (block) {
  const dropdown_animal = block.getFieldValue('Verso del');
  const code = `get_music().play_animal("${dropdown_animal}")\n`;
  return code;
};

import imgMusicPause from '@/assets/images/blocks/pause_symbol.png';

Blockly.Blocks.coderbot_music_pause_basic = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(imgMusicPause, 30, 30, {
        alt: '*',
        flipRtl: 'FALSE'
      }))
      .appendField('Pausa');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_pause_basic"] = function (block) {
  const value_duration = 1;
  const code = `get_music().play_pause(${value_duration})\n`;
  return code;
};

Blockly.Blocks.coderbot_music_note_std = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(imgMusicNote, 30, {
        alt: 'note',
        flipRtl: 'FALSE'
      }))
      .appendField('nota')
      .appendField(new Blockly.FieldDropdown([
        ['DO      ', 'C2'],
        ['RE      ', 'D2'],
        ['MI       ', 'E2'],
        ['FA       ', 'F2'],
        ['FA #   ', 'F#2'],
        ['SOL    ', 'G2'],
        ['LA       ', 'A2'],
        ['SI b      ', 'Bb2'],
        ['SI        ', 'B2'],
        ['DO+    ', 'C3'],
        ['RE+     ', 'D3']
      ]), 'note');
    this.appendDummyInput()
      .appendField('strumento')
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.instrumentlist), 'instrument');
    this.appendValueInput('duration')
      .setCheck('Number')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('durata');
    this.appendDummyInput()
      .appendField('secondi');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_note_std"] = function (block) {
  const dropdown_note = block.getFieldValue('note');
  const dropdown_instrument = block.getFieldValue('instrument');
  const value_duration = Blockly_Python.valueToCode(block, 'duration', Blockly_Python.ORDER_ATOMIC);
  const alteration = 'none';
  const code = `get_music().play_note(note="${dropdown_note}", instrument="${dropdown_instrument}", alteration="${alteration}", duration=${value_duration})\n`;
  return code;
};

import imgMusicAnimal from '@/assets/images/blocks/animal.png';

Blockly.Blocks.coderbot_animal_verse_std = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(imgMusicAnimal, 30, 30, {
        alt: 'note',
        flipRtl: 'FALSE'
      }))
      .appendField('nota')
      .appendField(new Blockly.FieldDropdown([
        ['DO      ', 'C2'],
        ['RE      ', 'D2'],
        ['MI       ', 'E2'],
        ['FA       ', 'F2'],
        ['FA #   ', 'F#2'],
        ['SOL    ', 'G2'],
        ['LA       ', 'A2'],
        ['SI b      ', 'Bb2'],
        ['SI        ', 'B2'],
        ['DO+    ', 'C3'],
        ['RE+     ', 'D3']
      ]), 'note');
    this.appendDummyInput()
      .appendField('animale')
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.animalist), 'instrument');
    this.appendValueInput('duration')
      .setCheck('Number')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('durata');
    this.appendDummyInput()
      .appendField('secondi');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_animal_verse_std"] = function (block) {
  const dropdown_note = block.getFieldValue('note');
  const dropdown_instrument = block.getFieldValue('instrument');
  const value_duration = Blockly_Python.valueToCode(block, 'duration', Blockly_Python.ORDER_ATOMIC);
  const alteration = 'none';
  const code = `get_music().play_animal(note="${dropdown_note}", instrument="${dropdown_instrument}", alteration="${alteration}", duration=${value_duration})\n`;
  return code;
};

Blockly.Blocks.coderbot_music_pause_std = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(imgMusicPause, 30, 30, {
        alt: '*',
        flipRtl: 'FALSE'
      }))
      .appendField('pausa');
    this.appendValueInput('duration')
      .setCheck('Number')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('durata');
    this.appendDummyInput()
      .appendField('secondi');
    this.setInputsInline(true);
    this.setColour(345);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_pause_std"] = function (block) {
  const value_duration = Blockly_Python.valueToCode(block, 'duration', Blockly_Python.ORDER_ATOMIC);
  const code = `get_music().play_pause(${value_duration})\n`;
  return code;
};

Blockly.Blocks.coderbot_music_note_adv = {
  init() {
    this.appendDummyInput()
      .appendField('nota')
      .appendField(new Blockly.FieldDropdown([
        ['DO', 'C2'],
        ['RE', 'D2'],
        ['MI', 'E2'],
        ['FA', 'F2'],
        ['SOL', 'G2'],
        ['LA', 'A2'],
        ['SI', 'B2'],
        ['DO+', 'C3'],
        ['RE+', 'D3']
      ]), 'note')
      .appendField(new Blockly.FieldDropdown([
        ['nessuna alterazione', 'none'],
        ['b', 'bmolle'],
        ['#', 'diesis']
      ]), 'alteration');
    this.appendValueInput('instrument')
      .setCheck('String')
      .appendField('strumento');
    this.appendValueInput('duration')
      .setCheck('Number')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('durata');
    this.appendDummyInput()
      .appendField('secondi');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_note_adv"] = function (block) {
  const dropdown_note = block.getFieldValue('note');
  const dropdown_alteration = block.getFieldValue('alteration');
  const value_instrument = Blockly_Python.valueToCode(block, 'instrument', Blockly_Python.ORDER_ATOMIC);

  const value_duration = Blockly_Python.valueToCode(block, 'duration', Blockly_Python.ORDER_ATOMIC);

  const code = `get_music().play_note(note="${dropdown_note}", alteration="${dropdown_alteration}" ,instrument=${value_instrument} ,duration=${value_duration})\n`;
  return code;
};

Blockly.Blocks.coderbot_music_instrument_adv = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.instrumentlist), 'instrument');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_instrument_adv"] = function (block) {
  const dropdown_instrument = block.getFieldValue('instrument');
  const code = `"${dropdown_instrument}"`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_music_animal_adv = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.CoderBotSettings.animalist), 'instrument');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_animal_adv"] = function (block) {
  const dropdown_instrument = block.getFieldValue('instrument');
  const code = `"${dropdown_instrument}"`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_music_pause_adv = {
  init() {
    this.appendDummyInput()
      .appendField('pausa');
    this.appendValueInput('duration')
      .setCheck('Number')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('durata');
    this.appendDummyInput()
      .appendField('secondi');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly_Python.forBlock["coderbot_music_pause_adv"] = function (block) {
  const value_duration = Blockly_Python.valueToCode(block, 'duration', Blockly_Python.ORDER_ATOMIC);
  const code = `get_music().play_pause(${value_duration})\n`;
  return code;
};

Blockly_Python.forBlock["coderbot_audio_listen"] = function (block) {
  // Boolean values true and false.
  const model = block.getFieldValue('MODEL');
  const code = `${sbsPrefix}get_audio().speech_recog_google(locale='${model}')`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_sonar_get_distance = {
  /**
   * Block for get_distance function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(250);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_SONAR_GET_DISTANCE)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_SONAR_SENSOR_1, '0'],
        [Blockly.Msg.CODERBOT_SONAR_SENSOR_2, '1'],
        [Blockly.Msg.CODERBOT_SONAR_SENSOR_3, '2'],
      ]), 'SONAR');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_sonar_get_distance"] = function (block) {
  // Boolean values true and false.
  const sonar = block.getFieldValue('SONAR');
  const code = `${sbsPrefix}get_bot().get_sonar_distance(${sonar})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_mpu_get_accel = {
  /**
   * Block for get_distance function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_MPU_GET_ACCEL)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_MPU_AXIS_X, '0'],
        [Blockly.Msg.CODERBOT_MPU_AXIS_Y, '1'],
        [Blockly.Msg.CODERBOT_MPU_AXIS_Z, '2']
      ]), 'AXIS');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_mpu_get_accel"] = function (block) {
  // Boolean values true and false.
  const axis = block.getFieldValue('AXIS');
  const code = `get_bot().get_mpu_accel(${axis})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_mpu_get_gyro = {
  /**
   * Block for get_distance function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_MPU_GET_GYRO)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_MPU_AXIS_X, '0'],
        [Blockly.Msg.CODERBOT_MPU_AXIS_Y, '1'],
        [Blockly.Msg.CODERBOT_MPU_AXIS_Z, '2']
      ]), 'AXIS');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_mpu_get_gyro"] = function (block) {
  // Boolean values true and false.
  const axis = block.getFieldValue('AXIS');
  const code = `get_bot().get_mpu_gyro(${axis})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_mpu_get_heading = {
  /**
   * Block for get_distance function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_MPU_GET_HEADING);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_mpu_get_heading"] = function (block) {
  // Boolean values true and false.
  const code = 'get_bot().get_mpu_heading()';
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_mpu_get_temp = {
  /**
   * Block for get_distance function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_MPU_GET_TEMP);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_mpu_get_temp"] = function (block) {
  // Boolean values true and false.
  const code = 'get_bot().get_mpu_temp()';
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_atmega_get_input = {
  /**
   * Block for get_input function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_ATMEGA_READ)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_ATMEGA_AI_1, '0'],
        [Blockly.Msg.CODERBOT_ATMEGA_AI_2, '1'],
        [Blockly.Msg.CODERBOT_ATMEGA_DI_3, '2'],
        [Blockly.Msg.CODERBOT_ATMEGA_DI_4, '3'],
        [Blockly.Msg.CODERBOT_ATMEGA_DI_5, '4'],
        [Blockly.Msg.CODERBOT_ATMEGA_DI_6, '5']
      ]), 'INPUT');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_atmega_get_input"] = function (block) {
  // input index: 0, 1 are Analogs, 2..5 are Digital
  const input = block.getFieldValue('INPUT');
  const code = `get_atmega().get_input(${input})`;
  return [code, Blockly_Python.ORDER_ATOMIC];
};

Blockly.Blocks.coderbot_atmega_set_output = {
  /**
   * Block for set_output function.
   * @this Blockly.Block
   */
  init() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CODERBOT_ATMEGA_WRITE)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.CODERBOT_ATMEGA_DO_1, '0'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_2, '1'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_3, '2'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_4, '3'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_5, '4'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_6, '5'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_7, '6'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_8, '7'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_9, '8'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_10, '9'],
        [Blockly.Msg.CODERBOT_ATMEGA_DO_11, '10']
      ]), 'OUTPUT');
    this.appendValueInput('VALUE')
      .setCheck('Boolean')
      .appendField(Blockly.Msg.CODERBOT_ATMEGA_VALUE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  },
};

Blockly_Python.forBlock["coderbot_atmega_set_output"] = function (block) {
  // input index: 0, 10 are Digital
  const output = block.getFieldValue('OUTPUT');
  const value = Blockly_Python.valueToCode(block, 'VALUE',
    Blockly_Python.ORDER_NONE) || '\'\'';
  const code = `get_atmega().set_output(${output}, ${value})\n`;
  return code;
};

Blockly.Blocks['coderbot_atmega_set_led'] = {
  /**
   * Block for set_output function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(240);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_SET)
    this.appendValueInput('BEGIN')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_BEGIN);
    this.appendValueInput('END')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_END);
    this.appendValueInput('RED')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_RED);
    this.appendValueInput('GREEN')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_GREEN);
    this.appendValueInput('BLUE')
        .setCheck('Number')
        .appendField(Blockly.Msg.CODERBOT_ATMEGA_LED_BLUE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly_Python.forBlock['coderbot_atmega_set_led'] = function(block) {
  // input index: 0, 10 are Digital
  var begin = Blockly_Python.valueToCode(block, 'BEGIN', Blockly_Python.ORDER_NONE);
  var end = Blockly_Python.valueToCode(block, 'END', Blockly_Python.ORDER_NONE);
  var red = Blockly_Python.valueToCode(block, 'RED', Blockly_Python.ORDER_NONE);
  var green = Blockly_Python.valueToCode(block, 'GREEN', Blockly_Python.ORDER_NONE);
  var blue = Blockly_Python.valueToCode(block, 'BLUE', Blockly_Python.ORDER_NONE);
  var code = 'get_atmega().set_led(' + begin + ', ' + end + ', ' + red + ', ' + green + ', ' + blue + ')\n';

  return code;
};
