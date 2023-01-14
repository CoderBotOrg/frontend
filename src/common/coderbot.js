import i18n from '../i18n/index';
import * as toolbox_full from '../assets/toolbox_adv.json';

class CoderBot {
  constructor(CB, axios, store) {
    this.CB = CB + '/api/v1';
    this.$axios = axios;
    this.$store = store;
    this.$i18n = i18n;
    this.config_loaded = false;
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
        const defaultActivity = {
          stock: true,
          default: true,
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
    const result = await this.$axios.get(`${this.CB}/music/packages`);
    const packagesInstalled = [];
    const music_packages = result.data;
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
    const result = await this.$axios.get(`${this.CB}/cnnmodels`);
    const cnnModels = [];
    const cnn_models = result.data;
    Object.entries(cnn_models).forEach((entry) => {
      const model_key = entry[0];
      // const model_data = entry[1];
      cnnModels.push({ key: model_key, text: model_key });
    });
    this.$store.commit('setCNNModels', cnnModels);
  }

  async loadSettings() {
    const result = await this.$axios.get(`${this.CB}/settings`);
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
    data.trimFactor = remoteConfig.move_motor_trim;
    data.motorMinPower = remoteConfig.motor_min_power;
    data.motorMaxPower = remoteConfig.motor_max_power;
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
    data.pidKP = remoteConfig.pid_kp
    data.pidKD = remoteConfig.pid_kd;
    data.pidKI = remoteConfig.pid_ki;
    data.pidMaxSpeed = remoteConfig.pid_max_speed,
    data.pidSampleTime = remoteConfig.pid_sample_time,
    data.audioLevel = remoteConfig.audio_volume_level;
    data.adminPassword = remoteConfig.admin_password;
    data.hardwareVersion = remoteConfig.hardware_version;
    data.progScrollbars = remoteConfig.prog_scrollbars;
    data.movementUseMPU = remoteConfig.movement_use_mpu;
    data.movementUseMotion = remoteConfig.movement_use_motion;
    data.movementUseEncoder = remoteConfig.movement_use_encoder;
    data.locale = remoteConfig.locale;
    this.$store.commit('setSettings', data);
  }

  async saveSettings(settings) {
    /* eslint-enable */
    const legacySettings = {
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
      move_motor_trim: settings.trimFactor,
      motor_min_power: settings.motorMinPower,
      motor_max_power: settings.motorMaxPower,
      sound_start: settings.startSound,
      sound_stop: settings.stopSound,
      sound_shutter: settings.shutterSound,
      load_at_start: settings.startupProgram,
      prog_level: settings.progLevel,
      move_fw_elapse: settings.moveFwdElapse,
      move_fw_speed: settings.moveFwdSpeed,
      move_tr_elapse: settings.moveTurnElapse,
      move_tr_speed: settings.moveTurnSpeed,
      pid_kp: settings.pidKP,
      pid_kd: settings.pidKD,
      pid_ki: settings.pidKI,
      pid_max_speed: settings.pidMaxSpeed,
      pid_sample_time: settings.pidSampleTime,
      ctrl_fw_elapse: settings.ctrlFwdElapse,
      ctrl_fw_speed: settings.ctrlFwdSpeed,
      ctrl_tr_elapse: settings.ctrlTurnElapse,
      ctrl_tr_speed: settings.ctrlTurnSpeed,
      audio_volume_level: settings.audioLevel,
      admin_password: settings.adminPassword,
      hardware_version: settings.hardwareVersion,
      prog_scrollbars: settings.progScrollbars,
      movement_use_mpu: settings.movementUseMPU,
      movement_use_motion: settings.movementUseMotion,
      movement_use_encoder: settings.movementUseEncoder,
      locale: settings.locale
    };
    this.$store.commit('setSettings', settings);
    return this.$axios.put(`${this.CB}/settings`, legacySettings);
  }

  reset() {
    return this.$axios.post(`${this.CB}/system/reset`);
  }

  restart() {
    return this.$axios.post(`${this.CB}/system/restart`);
  }

  reboot() {
    return this.$axios.post(`${this.CB}/system/reboot`);
  }

  halt() {
    return this.$axios.post(`${this.CB}/system/halt`);
  }

  getStatus() {
    const p1 = this.$axios.get(`${this.CB}/system/status`)
      .then((response) => {
        this.$store.commit('setStatus', response.data);
      }).catch((error) => {
        this.$store.commit('setStatus', null);
      });
    return Promise.all([p1]);
  }

  getInfo() {
    const p2 = this.$axios.get(`${this.CB}/system/info`)
      .then((response) => {
        this.$store.commit('setInfo', response.data);
      }).catch(error => {
        this.$store.commit('setInfo', null);
      });
    return Promise.all([p2]);
  }

  deleteMusicPackage(pkgNameID) {
    return this.$axios.post(`${this.CB}/deleteMusicPackage`, {
      package_name: pkgNameID,
    });
  }

  restoreSettings() {
    return this.$axios.post(`${this.CB}/settings/restore`);
  }

  updateFromPackage(formdata, config) {
    return this.$axios.post(`${this.CB}/updateFromPackage`, formdata, config);
  }

  test(checkedTests) {
    return this.$axios.post(`${this.CB}/testCoderbot`, {
      params: checkedTests
    });
  }

  updatePackages(formdata) {
    return this.$axios.post(`${this.CB}/updatePackages`, formdata);
  }

  loadActivity(activityName, activityDefault) {
    return this.$axios.get(`${this.CB}/activities/${activityName}`, {
      params: {
        default: activityDefault
      },
    });
  }

  getActivities() {
    return this.$axios.get(`${this.CB}/activities`);
  }

  deleteActivity(name) {
    return this.$axios.delete(`${this.CB}/activities/${name}`, {
      name,
    });
  }

  saveActivity(an_activity) {
    // defaults requird by API
    an_activity.description = an_activity.description == null ? '' : an_activity.description;
    an_activity.default = an_activity.default == null ? false : an_activity.default;
    an_activity.stock = an_activity.stock == null ? false : an_activity.stock;
    return this.$axios.post(`${this.CB}/activities`, an_activity);
  }

  saveProgram(overwrite, name, dom_code, code, is_default) {
    return this.$axios.put(`${this.CB}/programs/${name}`, {
      overwrite,
      name,
      dom_code,
      code,
      default: is_default
    });
  }

  listPrograms() {
    return this.$axios.get(`${this.CB}/programs`);
  }

  loadProgram(name) {
    return this.$axios.get(`${this.CB}/programs/${name}`);
  }

  deleteProgram(name) {
    return this.$axios.delete(`${this.CB}/programs/${name}`);
  }

  runProgram(name, code) {
    return this.$axios.post(`${this.CB}/programs/${name}/run`, {
      name: name,
      code: code,
    });
  }

  stopProgram(name) {
    return this.$axios.patch(`${this.CB}/programs/${name}/stop`, {});
  }

  programStatus(name) {
    return this.$axios.get(`${this.CB}/programs/${name}/status`);
  }

  status() {
    return this.$axios.get(`${this.CB}/system/status`);
  }

  info() {
    return this.$axios.get(`${this.CB}/system/info`);
  }

  move(speed, elapse, distance) {
    return this.$axios.post(`${this.CB}/control/move`, {
      speed: speed,
      elapse: elapse,
      distance: distance
    });
  }

  turn(speed, elapse, distance) {
    return this.$axios.post(`${this.CB}/control/turn`, {
      speed: speed,
      elapse: elapse,
      distance: distance
    });
  }

  stop() {
    return this.$axios.post(`${this.CB}/control/stop`);
  }

  speak(text, locale) {
    return this.$axios.post(`${this.CB}/control/speak`, {
      text: text,
      locale: locale
    });
  }

  takePhoto() {
    return this.$axios.post(`${this.CB}/media`);
  }

  recVideo() {
    return this.$axios.post(`${this.CB}/video/rec`);
  }

  stopVideo() {
    return this.$axios.post(`${this.CB}/video/stop`);
  }

  streamVideoURL() {
    return `${this.CB}/video/stream`;
  }

  getMediaList() {
    return this.$axios.get(`${this.CB}/media`);
  }

  deleteMedia(name) {
    return this.$axios.delete(`${this.CB}/media/${name}`);
  }

  getMediaURL(name) {
    return `${this.CB}/media/${name}`;
  }

}

export default CoderBot;
