// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Vue base
import Vue from 'vue';
import VueRouter from 'vue-router';

// Vuex
import store from './store/index'

import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import 'prismjs/themes/prism.css'

// Fonts
import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Components
import app from './App';
import landing from './components/Landing';
import arexample from './components/ARexample';
import run from './components/Run';
import blockly from './components/Blockly';
import activity from './components/Activity'
import settings from './components/Settings'

// Utils
import base64 from 'base-64'

// Configuration
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.prototype.$axios = axios.create();
Vue.prototype.$base64 = base64

Vue.config.productionTip = false;

// Routing
const routes = [
  { path: '/', component: landing },
  { path: '/run', component: run },
  { path: '/ar', component: arexample },
  { path: '/blockly', component: blockly},
  { path: '/new', component: activity},
  { path: '/settings', component: settings},
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});


/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(app),
});
