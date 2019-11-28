#!/bin/node
const fs = require('fs')
// Remove the first 2 arguments
process.argv.shift()
process.argv.shift()
const pkg = require(process.cwd() + `/../../meteor-app/package.json`) // eslint-disable-line global-require

fs.appendFileSync('../../mup-deploy.log', `${process.argv.join(' ')} ${pkg.version}\n`)
