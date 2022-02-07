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
import base64 from 'base-64';
import querystring from 'querystring';
import vuetify from './plugins/vuetify';
import store from './store/index';

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
import landing from './components/Landing';
import control from './components/Control';
import activityEditor from './components/ActivityEditor';
import settings from './components/Settings';
import gallery from './components/Gallery';
import activityList from './components/ActivityList';
import activity from './components/Activity';
// import help from './components/Help'
// import credits from './components/Credits'
// Utilities
// This is to serialize parameters to send them as URLencoded
// https://github.com/axios/axios/issues/350#issuecomment-227270046

// Configuration
Vue.use(VueRouter);
Vue.use(Vuelidate);

Vue.prototype.$axios = axios.create();
Vue.prototype.$base64 = base64;
Vue.prototype.$qs = querystring;

Vue.config.productionTip = false;

// Routing
const routes = [
  {
    name: 'home',
    path: '/',
    component: landing,
    meta: {
      title: 'CoderBot',
    }
  },
  {
    name: 'control',
    path: '/control',
    component: control,
    meta: {
      title: `CoderBot - ${i18n.t('message.control')}`,
    }
  },
  {
    name: 'program',
    path: '/program',
    component: activity,
    meta: {
      title: `CoderBot - ${i18n.t('message.program')}`,
    }
  },
  {
    name: 'gallery',
    path: '/settings',
    component: settings,
    meta: {
      title: `CoderBot - ${i18n.t('message.settings')}`,
    }
  },
  {
    path: '/gallery',
    component: gallery,
    meta: {
      title: `CoderBot - ${i18n.t('message.gallery')}`,
    }
  },
  // { path: '/help', component: help, meta: {title: 'CoderBot - Aiuto'}},
  // { path: '/credits', component: credits, meta: {title: 'CoderBot - Crediti'}},
  // { path: '/ar', component: arexample, meta: {title: 'CoderBot'} },
  {
    name: 'activity_new',
    path: '/activity/new',
    component: activityEditor,
    meta: {
      title: `CoderBot - ${i18n.t('message.activity_new')}`
    }
  },
  {
    name: 'activity_manage',
    path: '/activity/manage',
    component: activityList,
    meta: {
      title: `CoderBot - ${i18n.t('message.activity_manage')}`
    }
  },
  {
    name: 'activity_edit',
    path: '/activity/edit/:name',
    component: activityEditor,
    meta: {
      title: `CoderBot - ${i18n.t('message.activity_edit')}`
    }
  },
  {
    name: 'activity_open',
    path: '/activity/open/:name',
    component: activity,
    meta: {
      title: `CoderBot - ${i18n.t('message.activity_open')}`
    }
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes` (ES6)
});

// This callback works as middleware: runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  // const nearestWithMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags);
  // nearestWithMeta;

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  next();
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  i18n,
  el: '#app',
  render: (h) => h(app),
});
