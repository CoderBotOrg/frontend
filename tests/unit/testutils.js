import VueI18n from 'vue-i18n'; 

import * as it_messages from '../../src/locale/it/messages.json';
import * as en_messages from '../../src/locale/en/messages.json';
import * as fr_messages from '../../src/locale/fr/messages.json';

const messages = {
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

const i18n = new VueI18n({
  locale: 'it',
  fallbackLocale: 'en',
  messages
})

module.exports = {
  i18n: i18n
}