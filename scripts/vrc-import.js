const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const XLSX = require('xlsx')
const debug = require('debug')('app:vrc-import')

const finMap = {
  'Contact ID (Contact)': 'memberNo',
  Name: 'name',
  'Direct Debit': 'directDebit',
  'Guest Card': 'guestCard',
  'Pre-79 Card': 'pre79Card',
  'Car Pass': 'carPass',
  'Pay by Instalments': 'payByInstalments',
}

const offerMap = {
  Mbr: 'memberNo',
  Name: 'name',
  Subscription: 'subscription',
  'Guest Card': 'guestCard',
  'Pre-79 Card': 'pre79Card',
  'Car Pass': 'carPass',
  'Pay by Instalments': 'payByInstalments',
  Item1: 'item1',
  Item1Pmt: 'item1Pmt',
  Item2: 'item2',
  Item2Pmt: 'item2Pmt',
  Item3: 'item3',
  Item3Pmt: 'item3Pmt',
  Item4: 'item4',
  Item4Pmt: 'item4Pmt',
  Item5: 'item5',
  Item5Pmt: 'item5Pmt',
}

const deceasedMap = {
  'Contact ID': 'memberNo',
  'First Name': 'firstName',
  'Last Name': 'lastName',
  Status: 'status',
  'Status Reason': 'statusReason',
}

const sheets = [
  { name: 'Offer', map: offerMap },
  { name: 'Financial-Overdue', map: finMap },
  { name: 'Resigned-Deceased', map: deceasedMap },
]

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'b2b-app'
const server = opts.server || 'localhost'
const port = opts.port || '4090'
const protocol = opts.port === 443 ? 'wss' : 'ws'

if (opts.help) {
  console.log(`
#Usage:
	node scripts/vrc-import.js [--help] [--port=xxxx] [--folder=b2b-app] [--clear]
Where
  --server=localhost - server  (defaults to localhost)
  --port=4090 - server port (defaults to 4090)
  --folder=b2b-app - folder to write files (defaults to b2b-app)
  --clear - clear out punters collection

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
  const sub = meteor.subscribe('all.settings')
  await sub.ready()
  if (opts.clear) {
    debug('Clearing out all the punters')
    meteor.call('rm.all.punters')
  }
  // Read in the xl file
  const wb = XLSX.readFile('../renewals-21-22.xlsx', {})
  debug(Object.keys(wb))
  const errs = {}
  let n = 0
  for (sh of sheets) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sh.name])
    debug(sh.name, rows.length)
    let stack = []
    for (row of rows) {
      const rec = {}
      Object.keys(row).forEach((key) => {
        if (!sh.map[key]) {
          const err = `Did not find ${key} in ${sh.name} map`
          errs[err] = errs[err] ? errs[err] + 1 : 1
        } else {
          if (row[key]) rec[sh.map[key]] = row[key]
        }
      })
      switch (sh.name) {
        case 'Offer':
          rec.status = 'active'
          const counts = {}
          rec.items = '1 2 3 4 5'
            .split(/\s+/)
            .map((ix) => {
              if (rec[`item${ix}`]) {
                if (!counts[rec[`item${ix}`]]) counts[rec[`item${ix}`]] = 1
                else debug(`Duplicate item: ${rec[`item${ix}`]}`)
                return { name: rec[`item${ix}`], payment: rec[`item${ix}Pmt`] }
              }
            })
            .filter(Boolean)
          if (!rec.items.length) debug(`rec.name has NO ITEMS`)
          rec.itemCount = rec.items.length
          stack.push(rec)
          if (stack.length >= 1000) {
            debug(`Insert ${stack.length} punters`)
            const res = await meteor.call('insert.bulk.punters', stack)
            if (res.status === 'success') {
              n = n + stack.length
              debug(res.message)
            } else debug(res)
            stack = []
          }
          break
        case 'Resigned-Deceased':
          const { status, statusReason } = rec
          const res = await meteor.call('update.bymno.punters', rec.memberNo, {
            status,
            statusReason,
          })
          if (res.status !== 'success') {
            debug(res)
          }
          break
        default:
          const err = `I dunno how to process sheet ${sh.name}`
          errs[err] = errs[err] ? errs[err] + 1 : 1
          break
      }
    }
    if (stack.length >= 1) {
      const res = await meteor.call('insert.bulk.punters', stack)
      debug(res)
      if (res) n = n + stack.length
      stack = []
    }
  }
  debug('Errors', errs)

  await meteor.stopChangeListeners()
  await meteor.disconnect()
  console.log(`Done, inserted ${n} offers `)
}

console.log(`Connecting to Meteor server on ${options.endpoint}`)
const meteor = new simpleDDP(options)
doit(meteor)
