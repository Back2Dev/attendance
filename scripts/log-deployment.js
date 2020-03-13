#!/bin/node
const fs = require('fs')
const git = require('git-rev')

// Read the mup.js file to get config information
const m = require(process.cwd() + '/mup')

// Remove the first 2 arguments
process.argv.shift()
process.argv.shift()
const pkg = require(process.cwd() + `/${m.app.path}/package.json`) // eslint-disable-line global-require


git.branch(function(branch) {
	fs.appendFileSync('../../mup-deploy.log', `${process.argv.join(' ')} ${branch} ${m.app.env.ROOT_URL} ${pkg.version}\n`)
})
