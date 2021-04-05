const simpleDDP = require('simpleddp')
const debug = require('debug')('se:run-e2e')
const { runResults } = require('../se2-admin/imports/api/utils/results-cache')

const opts = require('minimist')(process.argv.slice(2))

const results = require('../test-data/e2e-results.json')

// Show what happened in the tests
for (const result of results) {
  if (result.status) {
    console.error(result)
  } else runResults(result, describe, it)
}
