// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Vue base
import Vue from 'vue';
import VueRouter from 'vue-router';

// Vuex
import store from './store/index'

// Main components
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// PrismJS style (syntax highlight)
//import 'prismjs/themes/prism.css'

// Fonts
import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Components
import app from './App';
import landing from './components/Landing';
//import arexample from './components/ARexample';
import control from './components/Control';
import blockly from './components/Blockly';
//import activityEditor from './components/ActivityEditor'
import settings from './components/Settings'

// Utilities
import base64 from 'base-64'

// Configuration
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.prototype.$axios = axios.create();
Vue.prototype.$base64 = base64

Vue.config.productionTip = false;

// Routing
const routes = [
  { path: '/', component: landing, meta: {title: 'CoderBot'} },
  { path: '/control', component: control, meta: {title: 'CoderBot - Controlla'} },
  { path: '/program', component: blockly, meta: {title: 'CoderBot - Blockly'}},
  { path: '/settings', component: settings , meta: {title: 'CoderBot - Impostazioni'}},
  //{ path: '/ar', component: arexample, meta: {title: 'CoderBot'} },
  //{ path: '/new', component: activityEditor, meta: {title: 'CoderBot - Nuova Attività'}},
];


const router = new VueRouter({
  routes, // short for `routes: routes` (ES6)
});

// This callback works as middleware: runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  next();
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(app),
});
