import { createI18n } from 'vue-i18n';

import * as it_messages from './locales/it/messages.json';
import * as en_messages from './locales/en/messages.json';
import * as fr_messages from './locales/fr/messages.json';
import * as es_messages from './locales/es/messages.json';
import * as de_messages from './locales/de/messages.json';

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
  es: {
    message: es_messages.default,
  },
  de: {
    message: de_messages.default,
  },
};

const language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2);

console.log(language);

/* eslint-disable new-cap */
export default new createI18n({
  locale: language,
  messages: locales,
  fallbackLocale: 'en',
  globalInjection: true
});
