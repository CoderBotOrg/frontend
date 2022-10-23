/* eslint-env node */
/*
module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  }
}
*/

// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,

  env: {
    node: true
  },

  ignorePatterns: ['src/assets/js/**/*.js'],

  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'airbnb-base',

  ],

  parserOptions: {
    ecmaVersion: 'latest'
  },

  rules: {
    'comma-dangle': 'off',
    'no-tabs': 'off',
    'no-console': 'off',
    'max-len': 'off',
    'import/no-unresolved': 'off',
    eqeqeq: 'off',
    'import/extensions': 'off',
    camelcase: 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-multi-str': 'off',
    'prefer-destructuring': 'off',
    'vue/valid-v-for': 'off',
    'no-plusplus': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'vue/no-v-for-template-key': 'off',
    'vue/multi-word-component-names': ['error', {
      ignores: ['Activity', 'Control', 'Gallery', 'Landing', 'Settings', 'Sidebar']
    }]
  },

  plugins: [
    'vue'
  ],

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
