class CoderBot {
  constructor(CB, APIv1, APIv2, axios, store) {
    this.CB = CB + APIv2;
    this.CBv1 = CB + APIv1;
    this.$axios = axios;
    this.$store = store;
  }

  load() {
    const p1 = this.loadSettings();
    const p2 = this.loadMusicPackages();
    const p3 = this.loadCNNModels();
    return Promise.all([p1, p2, p3]);
  }

  async loadMusicPackages() {
    const result = await this.$axios.get(`${this.CB}/listMusicPackages`);
    const packagesInstalled = [];
    const music_packages = JSON.parse(result.data);
    Object.entries(music_packages).forEach((key) => {
      const package_key = key[0];
      const music_package = key[1];
      const names = [music_package.name_IT, package_key];
      if (music_package.category == 'instrument') {
        packagesInstalled.push([names, 'instrument']);
      } else if (music_package.category == 'animal') {
        packagesInstalled.push([names, 'animal']);
      }
    });
    this.$store.commit('setMusicPackages', packagesInstalled);
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
    const p3 = this.$axios.get(`${this.CB}/logs`)
      .then((response) => {
        this.$store.commit('setLogs', response.data);
      });
    return Promise.all([p1, p2, p3]);
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
}

export default CoderBot;
