const fs = require('fs')
const ws = require('isomorphic-ws')
const simpleDDP = require('simpleddp')
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'starter-app'
const port = opts.port || '3080'

if (opts.help) {
  console.log(`
#Usage:
	node scripts/glue.messages.js [--folder=starter-app]
Where
  --folder=starter-app - folder to write files (defaults to starter-app)

#Prerequisites
	- Running app on http://localhost:${port}/

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

try {
  const files = `sms-templates.js email-templates.js app-templates.js`.split(/[\n\s]+/)

  const baseDir = `../${folder}/packages/fixtures/js-data`

  const messages = files.map((file) => require(`${baseDir}/${file}`))

  const output = []

  messages.map((type) => {
    type.map((message) => {
      output.push(message)
    })
  })

  const outFile = `./${folder}/packages/fixtures/json/message-templates.json`
  console.log(`Saving glued messages (${messages.length}) to ${outFile}`)
  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), {
    encoding: 'utf8',
  })
} catch (e) {
  console.log(`Error: ${e.message}`)
}
