#!/bin/node
const fs = require('fs')
const exec = require('child_process').exec

function gitBranch(cmd, dirname, cb) {
  exec(cmd, {}, function (err, stdout, stderr) {
    cb(stdout.split('\n').join(''))
  })
}

// Read the mup.js file to get config information
const mupFile = process.cwd() + '/mup.js'
let pkgFile = process.cwd() + `/package.json`
let ROOT_URL = process.env.API_URL
let PATH = process.cwd()
let mupLogFile = '../mup-deploy.log'
if (fs.existsSync(mupFile)) {
  m = require(mupFile)
  pkgFile = process.cwd() + `/${m.app.path}/package.json`
  ROOT_URL = m.app.env.ROOT_URL
  PATH = m.app.path
  mupLogFile = '../../mup-deploy.log'
}
// Remove the first 2 arguments
process.argv.shift()
process.argv.shift()
const pkg = require(pkgFile) // eslint-disable-line global-require

gitBranch(`git -C ${PATH} rev-parse --abbrev-ref HEAD`, PATH, function (branch) {
  fs.appendFileSync(
    mupLogFile,
    `${process.argv.join(' ')} ${branch} ${ROOT_URL} ${pkg.version}\n`
  )
})
