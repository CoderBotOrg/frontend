'use strict'
const cp =  require('child_process')
const lastCommit = '"' + cp.execSync('git rev-parse HEAD').toString().trim().substring(0, 7) + '"'

module.exports = {
  NODE_ENV: '"production"',
  // Backend location. Must point to the exposed Flask instance
  CB_ENDPOINT: '""',
  // Legacy APIs
  APIv1: '""',
  // New API, exposed by Connexion
  APIv2: '"/v2"',
  lastCommit: lastCommit
}
