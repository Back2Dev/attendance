const fs = require('fs')
const _ = require('lodash')
const prettier = require('prettier')
const prettierRules = require('../.prettierrc.json')
// This feels clumsy, something changed in the change-case module, but the doco doesn't explain how to bring in additional modules
const cc = require('change-case')
const { titleCase } = require('title-case')

cc.titleCase = titleCase

prettierRules.parser = 'babel'

const debug = require('debug')('app:collection-scripts')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
const folder = opts.folder || 'b2b-app'

if (opts.help ) {
  console.log(`
#Usage:
	node scripts/bind-collections.js [--help]  [--folder=b2b-app]
Where
  --folder=b2b-app - folder to write files (defaults to b2b-app)

#Prerequisites
	- project folder containing /imports/api/collections

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

const unwanted = 'users collections profiles audits logs utils counters'.split(/[\s,]+/)
const apiFolder = `${folder}/imports/api`
const collections = fs.readdirSync(apiFolder)
.filter(dir => fs.lstatSync(`${apiFolder}/${dir}`).isDirectory() )
.filter(dir => dir.match(/s$/))
.filter(dir => !unwanted.includes(dir))
.map(dir => ({folder: dir, collection: cc.titleCase(dir).replace('-',''), name: cc.camelCase(dir)}))
const mergeData = {
  IMPORT_SCHEMAS: collections
  .map(c =>`import ${c.name}, { ${c.collection}Schema } from '/imports/api/${c.name}/schema'`)
  .join('\n'),
  COLLECTION_CASES: collections
  .map(c =>    {
    return `case '${c.name}':
  return { collection: ${c.name}, schema: ${c.collection}Schema }`
})
  .join('\n')
}
debug (mergeData)
//
// Now do the magic
//
const f = 'scripts/generator-templates/imports/api/collections/binder.js'
const destf = f.replace('scripts/generator-templates', folder)
console.info(`Templating file ${f} => ${destf}`)
const t = fs.readFileSync(f, 'utf8')
// if (opts.debug)
//   console.log("template=",t);
const tt = _.template(t)
const buf = tt(mergeData)
// if (opts.debug) {
//   console.log(`${willDo}writing ${destf}`);
// }
fs.writeFileSync(destf, prettier.format(buf, prettierRules))
  const n = 1

  console.log(`Done, saved ${n} files`)
