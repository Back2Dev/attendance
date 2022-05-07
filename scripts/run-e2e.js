const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const fs = require('fs')
const stringify = require('stringify-object')
const prettier = require('prettier')
const prettierRules = require('../.prettierrc.json')
prettierRules.parser = 'babel'
const osort = require('./lib/object-sort')
const debug = require('debug')('app:run-e2e')
const { _showResults } = require('../se2-admin/imports/api/utils/results-cache')
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'se2-admin'
const server = opts.server || 'localhost'
const port = opts.port || '3080'
const protocol = opts.port === 443 ? 'wss' : 'ws'

if (opts.help) {
  console.log(`
#Usage:
	node scripts/run-e2e.js
Where
  --server=localhost - server  (defaults to localhost)
  --port=3080 - server port (defaults to 3080)
  --only1 xxx - optional expression to match for top level (aka describe.only)
  --only2 xxx - optional expression to match next level (aka describe.only)

#Prerequisites
	- Running app on http(s)://${server}:${port}/

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

let options = {
  endpoint: `${protocol}://${server}:${port}/websocket`,
  SocketConstructor: ws,
  reconnectInterval: 5000,
}

const doit = async (meteor) => {
  await meteor.connect()
  // connection is ready here
  const sub = meteor.subscribe('all.messageTemplates')
  await sub.ready()

  const results = await meteor.call('e2e.tests', 1, opts.only1, opts.only2)
  fs.writeFileSync('./test-data/e2e-results.json', JSON.stringify(results, null, 2))

  await meteor.stopChangeListeners()
  await meteor.disconnect()
}

console.log(`Connecting to Meteor server on ${options.endpoint}`)
const meteor = new simpleDDP(options)
doit(meteor)
