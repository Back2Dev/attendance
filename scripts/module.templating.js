#!/usr/local/bin/node
'use strict'

const _ = require('lodash')
const fs = require('fs')
const shell = require('shelljs/global')
const recursive = require('recursive-readdir')
require('shelljs/global')
const git = require('git-rev')
const gitTag = require('git-tag')({ localOnly: true })
const gitStatus = require('git-status')

const doTemplating = require('./deploy-lib.js')

/* * * * * * * * * * * * * * * * * * 
 * 
 * This file does the job of generating code to import each of the templated modules
 *
 * * * * * * * * * * * * * * * * * */
// This file contains the list of targets that can be built
const choices = require('./choices')
const modules = require('./modules')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))
// Be forgiving on this one
if (opts['dry-run']) opts.dry_run = true
const willDo = opts.dry_run ? '(Not) ' : ''

if (opts.help) {
  console.log(`
#Usage:
	node ${0} -- [--help] [--minor|major] [--all] [--dry_run] --dev
Where
	--dry_run will go through the motions, but not actually execute any commands 

#Prerequisites
	- Development environment, eg node/git etc

#Processing:
  This command will do the following
    - generate routes, imports of publications etc
		`)
  process.exit(0)
}

const BANG = '\n * * * * * * * FAILED * * * * * * * * *\n\n'
function ABORT(msg) {
  console.error(BANG + msg + '\n' + BANG)
  process.exit(1)
}

//
// Recurse through the templates directory and mailmerge them into the target app
//   (you could template more than just the version no if you like)
//
const tdir = './templates'
try {
  fs.existsSync(tdir)
} catch (e) {
  throw new Error("Can't find templates directory " + e)
}

let level = ''

function doCmd(cmd) {
  if (opts.debug) console.log(`${willDo}Executing command: ${cmd}`)
  if (!opts.dry_run && exec(cmd).code !== 0) {
    ABORT('Error: command failed (' + cmd + ')')
  }
}

if (Object.keys(choices).indexOf(opts._[0]) === -1) {
  ABORT('Fatal error: You must specify one of ' + Object.keys(choices).join(', '))
}
const choice = choices[opts._[0]] // Get a reference to the choice made with the command line parameter
if (choice.level) level = choice.level
if (!choice.app) choice.app = 'app' // Provide a default to be safe

//
// Read the package file - specifically get the version
//
const pkg = require(process.cwd() + `/${choice.app}/package.json`) // eslint-disable-line global-require
pkg.when = new Date()
git.long(function(str) {
  pkg.commit = str
})

console.log('Templating...')
doTemplating(pkg, opts.dry_run, choice, tdir, willDo, mainGame)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The main game....
//
function mainGame() {
  const cmds = []

  cmds.push('echo Done.')

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Run all the commands in sequence
  //
  cmds.forEach(cmd => {
    doCmd(cmd)
  })
}
