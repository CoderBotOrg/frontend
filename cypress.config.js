const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'm2n47r',
  viewportWidth: 1000,
  viewportHeight: 600,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      // implement node event listeners here
      return config
    },
  },
});
