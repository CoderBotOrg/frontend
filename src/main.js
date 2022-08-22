// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Vue base
import { createApp } from 'vue';

// Vuelidate
// import useVuelidate from '@vuelidate/core';

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

import App from './App.vue';

import router from './routes';

import CoderBot from './common/coderbot';

// Utilities
// This is to serialize parameters to send them as URLencoded
// https://github.com/axios/axios/issues/350#issuecomment-227270046

const $axios = axios.create();
const CB_ENDPOINT = import.meta.env.DEV == true ? 'http://localhost:8090' : 'http://localhost:8090';
const $coderbot = new CoderBot(CB_ENDPOINT, $axios, store);

// this will block until CoderBot returns several configuration data.
$coderbot.load().then(() => {
  console.log('config loaded');
  /* eslint-disable no-new */
  const app = createApp(App);
  // Configuration
  app.use(router);
  app.use(vuetify);
  app.use(store);
  app.use(i18n);

  app.config.globalProperties.$axios = $axios;
  app.config.globalProperties.$coderbot = $coderbot;
  app.mount('#app');
  app.defaultTheme = 'dark';
}).catch((errors) => {
  console.error(errors);
});
