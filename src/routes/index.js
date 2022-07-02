// VueRouter
import { createRouter, createWebHashHistory } from 'vue-router';

// Main components
import i18n from '../i18n/index';

import landing from '../components/Landing';
import control from '../components/Control';
import activityEditor from '../components/ActivityEditor';
import settings from '../components/Settings';
import gallery from '../components/Gallery';
import activityList from '../components/ActivityList';
import activity from '../components/Activity';
// import help from '../components/Help'
// import credits from '../components/Credits'

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
      title: `CoderBot - ${i18n.global.t('message.control')}`,
    }
  },
  {
    name: 'program',
    path: '/program',
    component: activity,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.program')}`,
    }
  },
  {
    name: 'settings',
    path: '/settings',
    component: settings,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.settings')}`,
    },
  },
  {
    name: 'gallery',
    path: '/gallery',
    component: gallery,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.gallery')}`,
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
      title: `CoderBot - ${i18n.global.t('message.activity_new')}`
    }
  },
  {
    name: 'activity_manage',
    path: '/activity/manage',
    component: activityList,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.activity_manage')}`
    }
  },
  {
    name: 'activity_edit',
    path: '/activity/edit/:name',
    component: activityEditor,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.activity_edit')}`
    }
  },
  {
    name: 'activity_open',
    path: '/activity/open/:name',
    component: activity,
    meta: {
      title: `CoderBot - ${i18n.global.t('message.activity_open')}`
    }
  },
];

/* eslint-disable new-cap */
const router = new createRouter({
  history: createWebHashHistory(),
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

export default router;
