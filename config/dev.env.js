'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE API ENDPOINTs, must point to the exposed Flask instance
  // legacy APIs
  CB_ENDPOINT_v1: '"http://localhost:5000"',
  // New Connexion API
  CB_ENDPOINT_v2: '"http://localhost:5000/v2"'
  // TODO: on production, should be '""'
})
