const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const fs = require('fs')
const stringify = require('stringify-object')
const osort = require('./lib/object-sort')
const prettier = require('prettier')
const prettierRules = require('../.prettierrc.json')
const { DateTime } = require('luxon')
prettierRules.parser = 'babel'

const debug = require('debug')('app:fixtures')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'meteor-app'
const server = opts.server || 'localhost'
const port = opts.port || '3030'
const protocol = opts.port === 443 ? 'wss' : 'ws'

if (opts.help) {
  console.log(`
#Usage:
	node scripts/insert-2022-courses.js  [--help] [--port=xxxx]
Where
  --server=localhost - server  (defaults to localhost)
  --port=3030 - server port (defaults to 3030)

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

const course = {
  name: 'Bicycle maintenance course',
  price: 36000,
  description: '6 week bicycle maintenance course - Starts Tues 14th Sep 2021',
  code: 'MAINT-ALL-TUE',
  type: 'course',
  active: true,
  autoRenew: false,
  image: '/images/maintenance.jpg',
  qty: 0,
  subsType: 'course',
}

const courses = [
  { code: 'MAINT-FEB-07', date: '2022-02-07' },
  { code: 'MAINT-FEB-08', date: '2022-02-08' },
  { code: 'MAINT-FEB-10', date: '2022-02-10' },
  { code: 'MAINT-APR-04', date: '2022-04-04' },
  { code: 'MAINT-APR-05', date: '2022-04-05' },
  { code: 'MAINT-APR-07', date: '2022-04-07' },
  { code: 'MAINT-JUN-06', date: '2022-06-06' },
  { code: 'MAINT-JUN-07', date: '2022-06-07' },
  { code: 'MAINT-JUN-09', date: '2022-06-09' },
  // Release these later
  // { code: 'MAINT-AUG-08', date: '2022-08-08' },
  //   { code: 'MAINT-AUG-09', date: '2022-08-09' },
  //   { code: 'MAINT-AUG-11', date: '2022-08-11' },
  //   { code: 'MAINT-OCT-10', date: '2022-10-10' },
  //   { code: 'MAINT-OCT-11', date: '2022-10-11' },
  //   { code: 'MAINT-OCT-13', date: '2022-10-13' },
]
let n = 0
const doit = async (meteor) => {
  await meteor.connect()
  // connection is ready here
  const sub = meteor.subscribe('all.products')
  await sub.ready()

  // get non-reactive collection data
  let products = await meteor.collection('products').fetch()
  for (c of courses) {
    course.code = c.code
    const when = DateTime.fromISO(c.date)
    const ends = when.plus({ weeks: 8 })
    course.description = `Course starts ${when.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    )}, and finishes ${ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`
    course.name = `6 week course: ${when.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    )} `.replace(', 2022', '')
    const existing = products.find((p) => p.code === c.code)
    if (existing) {
      debug(`Removing ${c.code} / ${existing.id}`)
      await meteor.call('rm.Products', existing.id)
    }
    const id = await meteor.call('insert.Products', course)
    if (id) n = n + 1
  }

  await meteor.stopChangeListeners()
  await meteor.disconnect()
  console.log(`Done, inserted ${n} courses`)
}

console.log(`Connecting to Meteor server on ${options.endpoint}`)
const meteor = new simpleDDP(options)
doit(meteor)
