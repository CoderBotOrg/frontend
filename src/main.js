// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Vue base
import Vue from 'vue';

// VueRouter
import VueRouter from 'vue-router';

// Vuelidate
import Vuelidate from 'vuelidate';

// Vuex
import axios from 'axios';
import vuetify from './plugins/vuetify';
import store from './store';

// Main components
import i18n from './i18n/index';

// Application Style
import './main.styl';

//			Fonts
// UI
import 'typeface-roboto';
import 'typeface-open-sans';
// Monospaced
import 'typeface-roboto-mono';
import 'typeface-ubuntu-mono';
// Icons
import '@fortawesome/fontawesome-free/css/all.css';
// Logos, headers
import 'typeface-quicksand';
import 'typeface-overpass';
import 'typeface-overpass-mono';

// Components
import app from './App.vue';

import router from './routes';

import CoderBot from './common/coderbot';

// Utilities
// This is to serialize parameters to send them as URLencoded
// https://github.com/axios/axios/issues/350#issuecomment-227270046

// Configuration
Vue.use(VueRouter);
Vue.use(Vuelidate);

Vue.prototype.$axios = axios.create();
Vue.prototype.$coderbot = new CoderBot(process.env.CB_ENDPOINT, process.env.APIv1, process.env.APIv2, Vue.prototype.$axios, store);

Vue.config.productionTip = false;

// this will block until CoderBot returns several configuration data.
Vue.prototype.$coderbot.load().then(() => {
  console.log('config loaded');
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    el: '#app',
    render: (h) => h(app),
  });
}).catch((errors) => {
  console.error(errors);
});
