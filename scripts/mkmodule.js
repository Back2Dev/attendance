#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var args = process.argv.slice(2)
var parser = require('./parse-module')
var templater = require('./template-module')

if (args.length < 2) {
  console.error(`Invalid arguments.
Usage: node ${process.argv[1]} db/schema/manual/xxx.json meteor-project-folder [ mongo|sql ]`)
  process.exit(1)
}

fs.readFile(args[0], { encoding: 'utf-8' }, function (err, data) {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    // Parse the input file and get a nice object
    const config = parser.parse(JSON.parse(data))
    // Use the object to iterate over the templates and put things into the project
    const db = args[2] || 'mongo'
    templater.templating(config, args[1], db)
    console.log(`

Admin code for ${args[1]} templated OK.

You probably want to do the following next: 

  * Edit ${args[1]}/imports/api/admin-items.js
  * Add the line   { id: 'your-collection', menu: 'Your Collection', fixtures: 0, pubs: 1, factory: 0 },
  * node scripts/module.templating ${args[1]}

    `)
  }
})
