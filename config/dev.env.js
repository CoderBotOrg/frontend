'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE API ENDPOINT, must point to the exposed Flask instance
  CB_ENDPOINT: '"http://localhost:5000"'
  // TODO: on production, should be '""'
})
