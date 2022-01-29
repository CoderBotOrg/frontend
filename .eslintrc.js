const { off } = require("node-notifier");

// https://eslint.org/docs/user-guide/configuring
module.exports = {
  "root": true,

  "env": {
    "node": true
  },

  "ignorePatterns": ["src/assets/js/**/*.js"],

  "extends": [
    "plugin:vue/base",
    "plugin:vue/essential",
    "eslint:recommended",
    'airbnb-base',
  ],

  "parserOptions": {
    "parser": "babel-eslint"
  },

  "rules": {
    "comma-dangle": "off",
    "no-tabs": "off",
    "no-console": "off",
    "max-len": "off",
    "import/no-unresolved": "off",
    "eqeqeq": "off",
    "import/extensions": "off",
    "camelcase": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-multi-str": "off",
    "prefer-destructuring": "off",
    "vue/valid-v-for": "off",
    "no-plusplus": "off",
    "global-require": "off",
    "import/no-dynamic-require": "off"
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
}
/*
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
*/
