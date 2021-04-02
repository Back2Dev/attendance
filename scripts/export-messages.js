const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const fs = require('fs')
const stringify = require('stringify-object')
const prettier = require('prettier')
const prettierRules = require('../.prettierrc.json')
prettierRules.parser = 'babel'
const osort = require('./lib/object-sort')
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'se2-admin'
const server = opts.server || 'localhost'
const port = opts.port || '3080'
const protocol = opts.port === 443 ? 'wss' : 'ws'
const file = 'message-templates'
const base = 'md-docz/src/'
const output = `./${folder}/packages/fixtures/json/${file}.json`

if (opts.help) {
  console.log(`
#Usage:
	node scripts/export-messages.js [--export]
Where
  --export will export fixtures files to ${folder}/packages/fixtures
  --server=localhost - server  (defaults to localhost)
  --port=3080 - server port (defaults to 3080)
  --folder=se2-admin - folder to write files (defaults to se2-admin)
  --js - Export EMAIL and SMS to separate fixtures/js-data/*.js files
  --docs - Export a documentation file

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

const sortFn = (a, b) => {
  const nameA = a.slug.toUpperCase() // ignore upper and lowercase
  const nameB = b.slug.toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  // names must be equal
  return 0
}

const doit = async (meteor) => {
  await meteor.connect()
  // connection is ready here
  const sub = meteor.subscribe('all.messageTemplates')
  await sub.ready()
  // get non-reactive collection data
  let messages = meteor.collection('messageTemplates').fetch().sort(sortFn)

  const msgs = messages.map((msg) => {
    delete msg.id
    delete msg.createdAt
    delete msg.updatedAt
    return msg
  })

  if (opts.export) {
    fs.writeFileSync(output, JSON.stringify(osort(msgs.sort(sortFn)), null, 2))
    console.log(`Done, saved ${msgs.length} messages to json file`)
  }

  if (opts.js) {
    'EMAIL SMS'.split(/\s+/).forEach((type) => {
      const subset = msgs.filter((msg) => msg.type === type)
      const file = `${folder}/packages/fixtures/js-data/${type.toLocaleLowerCase()}-templates.js`
      fs.writeFileSync(
        file,
        prettier.format(`module.exports = ${stringify(osort(subset))}`, prettierRules)
      )
    })
  }

  if (opts.docs) {
    const resp = await meteor.call('generate.events.md')
    if (resp.status === 'success') {
      const file = `${base}event-notifications.mdx`
      fs.writeFileSync(file, resp.result)
      console.log(`Saved file ${file}`)
    } else {
      console.error(`Markdown document creation failed for messages: ${resp.message}`)
    }
  }

  await meteor.stopChangeListeners()
  await meteor.disconnect()
}

console.log(`Connecting to Meteor server on ${options.endpoint}`)
const meteor = new simpleDDP(options)
doit(meteor)
