import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  drawer: false,
};

/* eslint "no-param-reassign": "off", "no-shadow": "off" */
const mutations = {
  toggleDrawer(state, val) {
    state.drawer = val;
  },
};
/* eslint "no-shadow": "off" */
const getters = {
  drawerStatus(state) {
    return state.drawer;
  },
};
const actions = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
});
