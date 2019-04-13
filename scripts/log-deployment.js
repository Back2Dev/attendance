#!/bin/node
const fs = require('fs')
// Remove the first 2 arguments
process.argv.shift()
process.argv.shift()
fs.appendFileSync('../../mup-deploy.log', `${process.argv.join(" ")} \n`)
