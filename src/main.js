// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Vue base
import Vue from 'vue';
import VueRouter from 'vue-router';

import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// Fonts
import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Components
import app from './App';
import landing from './components/Landing';
import arexample from './components/ARexample';
import run from './components/Run';
import blocklyTest from './components/BlocklyTest';
import activity from './components/Activity'

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
  { path: '/blockly', component: blocklyTest},
  { path: '/new', component: activity}
];

const router = new VueRouter({
	base: '/vue/',
  routes, // short for `routes: routes`
});


/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(app),
});
