'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// Beware, changes in this files require a new build. 
//  I.e. `npm run dev` is not aware of changes made here.

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // Backend location. Must point to the exposed Flask instance
  //  By default, if you run the backend locally, it's available at localhost:5000
  //  If you run the Vue app in production, served by the Flask backend, it should be '""'
  CB_ENDPOINT: '"http://localhost:5000"',
  // Legacy APIs
  APIv1: '""',
  // New API, exposed by Connexion
  APIv2: '"/v2"'
})
