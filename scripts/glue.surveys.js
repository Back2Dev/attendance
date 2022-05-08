const simpleDDP = require('simpleddp')
const ws = require('isomorphic-ws')
const fs = require('fs')
const debug = require('debug')('app:glue-surveys')
// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'starter-app'
const port = opts.port || '3080'

if (opts.help) {
  console.log(`
#Usage:
	node scripts/glue.workflows.js [--folder=starter-app]
Where
  --folder=starter-app - folder to write files (defaults to starter-app)

#Prerequisites
	- Running app on http://localhost:${port}/

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

const files = `survey-buyer-q.js
survey-seller-q.js
survey-caf.js
survey-cdc.js
survey-example.js
`
  .split(/[\n\s]+/)
  .filter((x) => x)

let options = {
  endpoint: `ws://localhost:${port}/websocket`,
  SocketConstructor: ws,
  reconnectInterval: 5000,
}

const prog = process.argv.length > 1 ? process.argv[1] : process.argv[0]
if (opts.help) {
  console.log(`
#Usage:
	node ${prog} -- [--help] [--survey] [--filler] [--only=slug]
Where
  --survey will generate/update survey files
  --filler will generate/update filler files
  --only=<slug> limit to this slug only 

#Prerequisites
	- Development environment, eg node/git etc

#Processing:
  This command will do the following
    - generate routes, imports of publications etc
		`)
  process.exit(0)
}

const accessByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

const doSurvey = async (server) => {
  try {
    console.log(`Connecting to Meteor server on ${options.endpoint}`)
    await server.connect()
    // connection is ready here
    const sub = server.subscribe('all.surveys')
    await sub.ready()

    // get non-reactive collection data
    const lookup = {}
    let records = server
      .collection('surveys')
      .fetch()
      .filter((s) => {
        if (opts.only) return opts.only === s.slug
        return true
      })
      .forEach((s) => (lookup[s.slug] = s.id))
    // .map((s) => s.id)
    // console.log('Removing',records)
    // for (id of records) {
    //   await server.call('rm.surveys', id)
    // }

    const baseDir = `../${folder}/packages/fixtures/js-data`

    const surveys = files.map((file) => require(`${baseDir}/${file}`))

    surveys.forEach((s) => {
      console.log(`Updating ${s.slug}`)
      s._id = lookup[s.slug]
      server.call('update.surveys', s)
    })

    const outFile = `./${folder}/packages/fixtures/json/surveys.json`
    console.log(`Saving glued surveys (${surveys.length}) to ${outFile}`)
    fs.writeFileSync(outFile, JSON.stringify(surveys, null, 2), {
      encoding: 'utf8',
    })

    await server.stopChangeListeners()
    await server.disconnect()
  } catch (e) {
    console.error(e.message)
  }
}

const doFiller = async (server) => {
  try {
    console.log(`Connecting to Meteor server on ${options.endpoint}`)
    await server.connect()
    // connection is ready here
    const sub = server.subscribe('all.surveys')
    await sub.ready()

    // get non-reactive collection data
    const lookup = {}
    let records = {}
    server
      .collection('surveys')
      .fetch()
      .filter((s) => {
        if (opts.only) return opts.only === s.slug
        return true
      })
      .forEach((s) => {
        records[s.slug] = s
      })

    const baseDir = `../${folder}/packages/fixtures/js-data`

    const surveys = files
      .map((file) => require(`${baseDir}/${file}`))
      .filter((s) => {
        if (opts.only) return opts.only === s.slug
        return true
      })

    for (s of surveys) {
      console.log(`Extracting schema for ${s.slug}`)
      s._id = records[s.slug].id
      const resp = await server.call('generate.survey.filler', s)
      if (resp.status === 'success') {
        if (!resp.survey) console.error('No survey returned')
        if (!resp.survey.steps) console.error('No steps returned')
        const fillers = { primary: [], secondary: [] }
        resp.survey.steps.forEach((step, ix) => {
          debug(ix, step.schema)
          Object.keys(step.schema).forEach((prop) => {
            fillers.primary.push({
              type: accessByPath(step, `schema.${prop}.type.name`) || 'string',
              id: prop,
            })
            const choices = accessByPath(step, `schema.${prop}.uniforms.options`)
            if (choices) {
              choices.forEach((choice) =>
                fillers.primary.push({
                  type: 'checkbox',
                  id: prop,
                  value: choice.value,
                })
              )
            }
          })
        })
        debug(fillers)
        // Update the fillers in the record and update the DB
        console.log(`Updating ${s.slug}`)
        const matchers = 'type id value'.split(/\s+/)
        const r = records[s.slug]
        const extras = []
        if (!r.primary) r.primary = []
        fillers.primary.filter((newOne) => {
          let exists = false
          r.primary.forEach((old) => {
            if (matchers.every((m) => old[m] === newOne[m])) {
              matchers.forEach((m) => {
                old[m] = newOne[m]
              })
              exists = true
              debug('Updated', old)
            }
          })
          if (!exists) extras.push(newOne) // Save it for now
        })
        r.primary = r.primary.concat(extras)
        r._id = records[s.slug].id
        debug(r.primary.filter((m) => m.id === 'buyerType'))
        server.call('update.surveys', r)
      }
    }

    // const outFile = `./${folder}/packages/fixtures/json/surveys.json`
    // console.log(`Saving glued surveys (${surveys.length}) to ${outFile}`)
    // fs.writeFileSync(outFile, JSON.stringify(surveys,null , 2), {
    //   encoding: 'utf8',
    // })

    await server.stopChangeListeners()
    await server.disconnect()
  } catch (e) {
    console.error(e.message)
  }
}

const reload = async (server) => {
  try {
    await server.connect()
    await server.call('loadFixtures', 'surveys')
    await server.stopChangeListeners()
    await server.disconnect()
  } catch (e) {
    console.error(e.message)
  }
}

try {
  const server = new simpleDDP(options)
  if (!opts.survey && !opts.filler) console.error('Options are --survey --filler')
  if (opts.survey) doSurvey(server)
  if (opts.filler) doFiller(server)
  // reload(server) // This was problematic, because modifying the JSON file caused a rebuild
} catch (e) {
  console.error(e.message)
}
