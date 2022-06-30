const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // bind to the event we care about
      // add plugin here and events.
      // pluginsFile: 'tests/cypress/plugins/index.js',
    },
    projectId: 'x46ikd',
    baseUrl: 'http://localhost:4090',
    execTimeout: 240000,
    taskTimeout: 180000,
    specPattern: 'imports/test/integration',
    downloadsFolder: 'imports/tests/cypress/downloads',
    fixturesFolder: 'imports/tests/cypress/fixtures',
    screenshotsFolder: 'imports/tests/cypress/screenshots',
    videosFolder: 'imports/tests/cypress/videos',
    experimentalStudio: true,
  },
})
