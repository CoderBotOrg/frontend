import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  drawer: false,
  info: null,
  status: null,
  settings: null,
  musicPackages: null,
  musicInstruments: null,
  musicAnimals: null,
  cnnModules: null,
  activity: null
};

/* eslint "no-param-reassign": "off", "no-shadow": "off" */
const mutations = {
  toggleDrawer(state, val) {
    state.drawer = val;
  },
  setInfo(state, val) {
    state.info = val;
  },
  setStatus(state, val) {
    state.status = val;
  },
  setLogs(state, val) {
    state.logs = val;
  },
  setSettings(state, val) {
    state.settings = val;
  },
  setMusicPackages(state, val) {
    state.musicPackages = val;
  },
  setMusicInstruments(state, val) {
    state.musicInstruments = val;
  },
  setMusicAnimals(state, val) {
    state.musicAnimals = val;
  },
  setCNNModels(state, val) {
    state.cnnModules = val;
  },
  setActivity(state, val) {
    state.activity = val;
  }
};
/* eslint "no-shadow": "off" */
const getters = {
  drawerStatus(state) {
    return state.drawer;
  },
  info(state) {
    return state.info;
  },
  status(state) {
    return state.status;
  },
  logs(state) {
    return state.logs;
  },
  settings(state) {
    return state.settings;
  },
  musicPackages(state) {
    return state.musicPackages;
  },
  musicInstruments(state) {
    return state.musicInstruments;
  },
  musicAnimals(state) {
    return state.musicAnimals;
  },
  cnnModules(state) {
    return state.cnnModules;
  },
  activity(state) {
    return state.activity;
  },
};
const actions = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
});
