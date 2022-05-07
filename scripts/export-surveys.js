const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const fs = require('fs')
const stringify = require('stringify-object')
const osort = require('./lib/object-sort')
const prettier = require('prettier')
const prettierRules = require('../.prettierrc.json')
prettierRules.parser = 'babel'

const debug = require('debug')('app:fixtures')

const base = 'md-docz/src/'
// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'se2-admin'
const server = opts.server || 'localhost'
const port = opts.port || '3080'
const protocol = opts.port === 443 ? 'wss' : 'ws'

if (opts.help || !(opts.fixtures )) {
  console.log(`
#Usage:
	node scripts/export-surveys.js [--only=slug] [--help] [--fixtures] [--port=xxxx] [--folder=se2-admin]
Where
  --only=slug - only export definitions for the given slug
  --fixtures will export fixtures files to ${folder}/packages/fixtures
  --server=localhost - server  (defaults to localhost)
  --port=3080 - server port (defaults to 3080)
  --folder=se2-admin - folder to write files (defaults to se2-admin)

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
  const sub = meteor.subscribe('all.surveys')
  await sub.ready()

  // get non-reactive collection data
  let surveys = meteor.collection('surveys').fetch()
  const srvs = surveys
    .map((srv) => {
      return { id: srv.id, slug: srv.slug }
    })
    .filter((srv) => (opts.test ? srv.slug.match(/^test/) : !srv.slug.match(/^test/)))
    .filter((srv) => (opts.only ? srv.slug === opts.only : true))

  let n = 0
  for (srv of srvs) {
    if (opts.fixtures) {
      const killers = 'id createdAt updatedAt'.split(/\s+/g)
      surveys
        .filter((survey) => survey.id === srv.id)
        .forEach((survey) => {
          killers.forEach((key) => delete survey[key])
          const file = `${folder}/packages/fixtures/js-data/survey-${survey.slug}.js`
          fs.writeFileSync(
            file,
            prettier.format(
              // `module.exports = ${stringify(osort(survey))}`,
              `module.exports = ${stringify(survey)}`,
              prettierRules
            )
          )
          console.log(`Saved file ${file}`)
          n = n + 1
        })
    }
  }
  await meteor.stopChangeListeners()
  await meteor.disconnect()
  console.log(`Done, saved ${n} files`)
}

console.log(`Connecting to Meteor server on ${options.endpoint}`)
const meteor = new simpleDDP(options)
doit(meteor)
