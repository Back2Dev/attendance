#!/bin/node
import fs from 'fs'
import { exec } from 'node:child_process'
import { myrequireJSON, importJS } from './mjslib/util.mjs'
import { DateTime } from 'luxon'
import mini from 'minimist'
import dbg from 'debug'

const debug = dbg('app:backup-db')

const usage = () => {
  console.log(`
  #Usage:
    node scripts/backup-db.mjs 
  Where
  
  #Prerequisites
    - Running database on remote mongo server
    - Firewall port allows us to connect
    - Mongo server has our ip whitelisted
  
  #Processing:
    This command will do the following
  
    `)
}
// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = mini(process.argv.slice(2), {
  boolean: ['help'],
  string: [],
  default: {},
  unknown: (unknownParam) => {
    usage()
    console.log(`Unknown parameter: ${unknownParam}, not proceeding\n`)
    process.exit(1)
  },
})

// Read the mup.js file to get config information
const doit = async () => {
  try {
    let mongo_url,
      appName = 'No name',
      clist = 'audits journals incoming logs'
    const mupFile = process.cwd() + '/mup.js'
    if (fs.existsSync(mupFile)) {
      const m = await importJS(mupFile)
      mongo_url = m.app.env.MONGO_URL
      appName = m.app.name
      if (m.app.backup?.exclude) clist = m.app.backup?.exclude
    }
    if (!mongo_url) {
      console.log('Could not determine mongo url')
      process.exit(1)
    }
    const backupFolder = `./backup-${DateTime.now().toFormat('yyyy-LL-dd')}`

    const exclusions = clist
      .split(/[\s,]+/g)
      .map((collection) => `--excludeCollection=${collection}`)
      .join(' ')
    const cmd = `mongodump --gzip ${exclusions} --out ${backupFolder} ${mongo_url}`
    debug(`Executing backup command\n  ${cmd}`)

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
    })
  } catch (e) {
    console.error(e)
  }
}

doit()
