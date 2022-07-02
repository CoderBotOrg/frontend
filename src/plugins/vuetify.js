// Vuetify
import { createVuetify } from 'vuetify';
// import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import '@mdi/font/css/materialdesignicons.css';
// import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

/* eslint-disable new-cap */
export default new createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    // defaultTheme: 'dark'
  }
});
