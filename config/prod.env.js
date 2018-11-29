'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // Backend location. Must point to the exposed Flask instance
  CB_ENDPOINT: '""',
  // Legacy APIs
  APIv1: '""',
  // New API, exposed by Connexion
  APIv2: '"/v2"'
}
