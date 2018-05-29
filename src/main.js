// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// Vue base
import Vue from 'vue';
import VueRouter from 'vue-router';

import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// Components
import App from './App';
import page from './components/Page';

import * as THREE from 'three';
import * as AR from 'ar.js/three.js/build/ar';

// import THREEx from './ar.js'

// Configuration
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.prototype.$axios = axios.create();
Vue.prototype.$THREE = THREE;
Vue.prototype.$THREEx = AR;

Vue.config.productionTip = false;

// Routing
const routes = [
  { path: '/', component: page },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});


/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
});
