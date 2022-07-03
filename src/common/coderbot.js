import i18n from '../i18n/index';

class CoderBot {
  constructor(CB, APIv1, APIv2, axios, store) {
    this.CB = CB + APIv2;
    this.CBv1 = CB + APIv1;
    this.$axios = axios;
    this.$store = store;
    this.$i18n = i18n;
    this.initActivity();
  }

  load() {
    const p1 = this.loadSettings();
    const p2 = this.loadMusicPackages();
    const p3 = this.loadCNNModels();
    return Promise.all([p1, p2, p3]);
  }

  initActivity() {
    this.loadActivity(null, true).then((activity) => {
      if (activity.data == '') {
        const toolbox_full = require('../assets/toolbox_adv.json');
        const defaultActivity = {
          stock: true,
          default: true,
          uiLang: 'browser',
          defaultView: null,
          exec: {
            camera: true,
            log: false
          },
          name: 'default',
          drawerEnabled: true,
          showName: true,
          showButtonLabel: true,
          description: '',
          fontSize: 'Medio',
          capsSwitch: true,
          bodyFont: 'Roboto',
          codeFont: 'ubuntumono',
          maxBlocks: 0,
          availableViews: [],
          viewSource: null,
          autoRecVideo: null,
          toolbox: null,
          buttons: [
            {
              action: 'clearProgramDlg',
              icon: 'mdi-close',
              label: this.$i18n.global.t('message.activity_program_clear'),
              type: 'text',
            },
            {
              action: 'saveProgram',
              icon: 'mdi-content-save',
              label: this.$i18n.global.t('message.activity_program_save'),
              type: 'text',
            },
            {
              action: 'toggleSaveAs',
              icon: 'mdi-content-save-edit',
              label: this.$i18n.global.t('message.activity_program_save_as'),
              type: 'text',
            },
            {
              action: 'loadProgramList',
              icon: 'mdi-folder-open',
              label: this.$i18n.global.t('message.activity_program_load'),
              type: 'text',
            },
            {
              action: 'runProgram',
              icon: 'mdi-play',
              label: this.$i18n.global.t('message.activity_program_run'),
              type: 'text',
            },
            {
              action: 'getProgramCode',
              icon: 'mdi-code-braces',
              label: this.$i18n.global.t('message.activity_program_show_code'),
              type: 'text',
            },
            {
              action: 'exportProgram',
              icon: 'mdi-export',
              label: this.$i18n.global.t('message.activity_program_export'),
              type: 'text',
            },
            {
              action: 'pickFile',
              icon: 'mdi-import',
              label: this.$i18n.global.t('message.activity_program_import'),
              type: 'text',
            }
          ]
        };
        toolbox_full.contents.forEach((item) => {
          if (item.name.startsWith('message.')) {
            /* eslint-disable no-param-reassign */
            item.name = this.$i18n.global.t(item.name);
          }
        });
        defaultActivity.toolbox = toolbox_full;
        this.saveActivity(defaultActivity);
      }
    });
  }

  async loadMusicPackages() {
    const result = await this.$axios.get(`${this.CB}/listMusicPackages`);
    const packagesInstalled = [];
    const music_packages = JSON.parse(result.data);
    const musicInstruments = [];
    const musicAnimals = [];
    Object.entries(music_packages).forEach((key) => {
      const package_key = key[0];
      const music_package = key[1];
      const names = [music_package.name_IT, package_key];
      if (music_package.category == 'instrument') {
        packagesInstalled.push([names, 'instrument']);
        musicInstruments.push(names);
      } else if (music_package.category == 'animal') {
        packagesInstalled.push([names, 'animal']);
        musicAnimals.push(names);
      }
    });
    this.$store.commit('setMusicPackages', packagesInstalled);
    this.$store.commit('setMusicInstruments', musicInstruments);
    this.$store.commit('setMusicAnimals', musicAnimals);
  }

  async loadCNNModels() {
    const result = await this.$axios.get(`${this.CB}/listCNNModels`);
    const cnnModels = [];
    const cnn_models = JSON.parse(result.data);
    Object.entries(cnn_models).forEach((entry) => {
      const model_key = entry[0];
      // const model_data = entry[1];
      cnnModels.push({ key: model_key, text: model_key });
    });
    this.$store.commit('setCNNModels', cnnModels);
  }

  async loadSettings() {
    const result = await this.$axios.get(`${this.CBv1}/config`);
    // handle success
    const data = {};
    const remoteConfig = result.data;
    data.power = [remoteConfig.move_power_angle_1, remoteConfig.move_power_angle_2, remoteConfig
      .move_power_angle_3
    ];
    data.ctrl_hud_image = remoteConfig.ctrl_hud_image;
    data.cv_image_factor = remoteConfig.cv_image_factor;
    data.camera_color_object_size_max = remoteConfig.camera_color_object_size_max;
    data.camera_color_object_size_min = remoteConfig.camera_color_object_size_min;
    data.camera_exposure_mode = remoteConfig.camera_exposure_mode;
    data.camera_framerate = remoteConfig.camera_framerate;
    data.camera_jpeg_bitrate = remoteConfig.camera_jpeg_bitrate;
    data.camera_jpeg_quality = remoteConfig.camera_jpeg_quality;
    data.camera_path_object_size_max = remoteConfig.camera_path_object_size_max;
    data.camera_path_object_size_min = remoteConfig.camera_path_object_size_min;
    data.cnn_default_model = remoteConfig.cnn_default_model;
    data.btnFun = remoteConfig.button_func;
    data.wifiMode = remoteConfig.wifi_mode;
    data.wifiSSID = remoteConfig.wifi_ssid;
    data.wifiPsw = remoteConfig.wifi_psk;
    data.motorMode = remoteConfig.move_motor_mode;
    data.trimFactor = remoteConfig.move_motor_trim;
    data.startSound = remoteConfig.sound_start;
    data.stopSound = remoteConfig.sound_stop;
    data.shutterSound = remoteConfig.sound_shutter;
    data.startupProgram = remoteConfig.load_at_start;
    data.progLevel = remoteConfig.prog_level;
    data.moveFwdElapse = remoteConfig.move_fw_elapse;
    data.moveFwdSpeed = remoteConfig.move_fw_speed;
    data.moveTurnElapse = remoteConfig.move_tr_elapse;
    data.moveTurnSpeed = remoteConfig.move_tr_speed;
    data.ctrlFwdElapse = remoteConfig.ctrl_fw_elapse;
    data.ctrlFwdSpeed = remoteConfig.ctrl_fw_speed;
    data.ctrlTurnElapse = remoteConfig.ctrl_tr_elapse;
    data.ctrlTurnSpeed = remoteConfig.ctrl_tr_speed;
    data.audioLevel = remoteConfig.audio_volume_level;
    data.adminPassword = remoteConfig.admin_password;
    data.hardwareVersion = remoteConfig.hardware_version;
    this.$store.commit('setSettings', data);
  }

  async saveSettings(settings) {
    /* eslint-enable */
    const legacySettings = new URLSearchParams({
      ctrl_hud_image: settings.ctrl_hud_image,
      cv_image_factor: settings.cv_image_factor,
      camera_color_object_size_max: settings.camera_color_object_size_max,
      camera_color_object_size_min: settings.camera_color_object_size_min,
      camera_exposure_mode: settings.camera_exposure_mode,
      camera_framerate: settings.camera_framerate,
      camera_jpeg_bitrate: settings.camera_jpeg_bitrate,
      camera_jpeg_quality: settings.camera_jpeg_quality,
      camera_path_object_size_max: settings.camera_path_object_size_max,
      camera_path_object_size_min: settings.camera_path_object_size_min,
      cnn_default_model: settings.cnn_default_model,
      wifi_mode: settings.wifiMode,
      wifi_ssid: settings.wifiSSID,
      wifi_psk: settings.wifiPsw,
      move_power_angle_1: settings.power[0],
      move_power_angle_2: settings.power[1],
      move_power_angle_3: settings.power[2],
      button_func: settings.btnFun,
      move_motor_mode: settings.motorMode,
      move_motor_trim: settings.trimFactor,
      sound_start: settings.startSound,
      sound_stop: settings.stopSound,
      sound_shutter: settings.shutterSound,
      load_at_start: settings.startupProgram,
      prog_level: settings.progLevel,
      move_fw_elapse: settings.moveFwdElapse,
      move_fw_speed: settings.moveFwdSpeed,
      move_tr_elapse: settings.moveTurnElapse,
      move_tr_speed: settings.moveTurnSpeed,
      ctrl_fw_elapse: settings.ctrlFwdElapse,
      ctrl_fw_speed: settings.ctrlFwdSpeed,
      ctrl_tr_elapse: settings.ctrlTurnElapse,
      ctrl_tr_speed: settings.ctrlTurnSpeed,
      audio_volume_level: settings.audioLevel,
      admin_password: settings.adminPassword,
      hardware_version: settings.hardwareVersion,

    });
    this.$store.commit('setSettings', settings);
    return this.$axios.post(`${this.CBv1}/config`, legacySettings);
  }

  reboot() {
    return this.$axios.get(`${this.CBv1}/bot`, {
      params: {
        cmd: 'reboot'
      }
    });
  }

  halt() {
    return this.$axios.get(`${this.CBv1}/bot`, {
      params: {
        cmd: 'halt'
      }
    });
  }

  getInfoAndStatus() {
    const p1 = this.$axios.get(`${this.CB}/status`)
      .then((response) => {
        this.$store.commit('setStatus', response.data);
      });
    const p2 = this.$axios.get(`${this.CB}/info`)
      .then((response) => {
        this.$store.commit('setInfo', response.data);
      });
    return Promise.all([p1, p2]);
  }

  deleteMusicPackage(pkgNameID) {
    return this.$axios.post(`${this.CB}/deleteMusicPackage`, {
      package_name: pkgNameID,
    });
  }

  restoreSettings() {
    return this.$axios.post(`${this.CB}/restoreSettings`);
  }

  updateFromPackage(formdata, config) {
    return this.$axios.post(`${this.CB}/updateFromPackage`, formdata, config);
  }

  reset() {
    return this.$axios.post(`${this.CB}/reset`);
  }

  test(checkedTests) {
    return this.$axios.post(`${this.CB}/testCoderbot`, {
      params: checkedTests
    });
  }

  saveWifiParams(wifiMode, wifiSSID, wifiPsw) {
    const valuesAsString = new URLSearchParams({
      wifi_mode: wifiMode,
      wifi_ssid: wifiSSID,
      wifi_psk: wifiPsw,
    });
    return this.$axios.post(`${this.CBv1}/wifi`, valuesAsString);
  }

  updatePackages(formdata) {
    return this.$axios.post(`${this.CB}/updatePackages`, formdata);
  }

  loadActivity(activityName, activityDefault) {
    return this.$axios.get(`${this.CB}/loadActivity`, {
      params: {
        name: activityName,
        default: activityDefault
      },
    });
  }

  getActivities() {
    return this.$axios.get(`${this.CB}/listActivities`);
  }

  deleteActivity(name) {
    return this.$axios.post(`${this.CB}/deleteActivity`, {
      name,
    });
  }

  saveActivity(an_activity) {
    return this.$axios.post(`${this.CB}/saveActivity`, {
      activity: an_activity
    });
  }

  saveProgram(overwrite, name, dom_code, code, is_default) {
    return this.$axios.post(`${this.CB}/saveProgram`, {
      overwrite,
      name,
      dom_code,
      code,
      default: is_default
    });
  }

  listPrograms() {
    return this.$axios.get(`${this.CB}/list`);
  }

  loadProgram(name) {
    return this.$axios.get(`${this.CB}/load`, {
      params: {
        name
      },
    });
  }

  deleteProgram(name) {
    return this.$axios.post(`${this.CB}/delete`, {
      name,
    });
  }

  status() {
    return this.$axios.get(`${this.CB}/status`);
  }

  info() {
    return this.$axios.get(`${this.CB}/info`);
  }

  execProgram(dom_code, code, options) {
    return this.$axios.post(`${this.CB}/exec`, {
      name: 'run program',
      dom_code,
      code,
      options
    });
  }

  stopProgram() {
    return this.$axios.post(`${this.CBv1}/program/end`);
  }

  programStatus() {
    return this.$axios.get(`${this.CBv1}/program/status`);
  }
}

export default CoderBot;
