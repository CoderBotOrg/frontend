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
import 'open-dyslexic'; // includes OpenDyslexic and OpenDyslexicMono
import 'typeface-open-sans';
import 'typeface-roboto';
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
import WifiConnect from './common/wifi_connect';

// Utilities
// This is to serialize parameters to send them as URLencoded
// https://github.com/axios/axios/issues/350#issuecomment-227270046

const $axios = axios.create();
const $coderbot = new CoderBot(import.meta.env.VITE_CB_ENDPOINT, $axios, store);
const $wifi_connect = new WifiConnect(import.meta.env.VITE_CB_ENDPOINT, $axios);

// this will block until CoderBot returns several configuration data.
/* eslint-disable no-new */
const app = createApp(App);
// Configuration

app.use(router);
app.use(vuetify);
app.use(store);
app.use(i18n);

app.config.globalProperties.$axios = $axios;
app.config.globalProperties.$coderbot = $coderbot;
app.config.globalProperties.$wifi_connect = $wifi_connect;
app.mount('#app');
app.defaultTheme = 'dark';

function loadConfig() {
  $coderbot.load().then(() => {
    console.log('config loaded');
    if(store.getters.settings.locale != 'browser') {
      i18n.global.locale = store.getters.settings.locale;
    }
  }).catch((errors) => {
    console.log('error loading config: ', errors);
    setTimeout(loadConfig, 1000);
  });  
}
$coderbot.getStatus();
setInterval(() => { 
  $coderbot.getStatus();
}, 1000);
loadConfig();