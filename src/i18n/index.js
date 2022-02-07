import Vue from 'vue';
import VueI18n from 'vue-i18n';

import * as it_messages from './locales/it/messages.json';
import * as en_messages from './locales/en/messages.json';
import * as fr_messages from './locales/fr/messages.json';

const locales = {
  it: {
    message: it_messages.default,
  },
  en: {
    message: en_messages.default,
  },
  fr: {
    message: fr_messages.default,
  },
};

Vue.use(VueI18n);

const language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2);

console.log(language);

export default new VueI18n({
  locale: language,
  messages: locales,
  fallbackLocale: 'en'
});
