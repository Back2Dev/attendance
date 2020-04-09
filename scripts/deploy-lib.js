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

// This file contains the list of targets that can be built
const choices = require('./choices')
const modules = require('./modules')

//
// We now do some templating of key config files
//
function doTemplating(pkg, dry_run, choice, tdir, willDo, nextFunc) {
  const basedir = process.cwd() + `/${choice.app}/`

  // if (opts.debug)
  // 	console.log("cwd="+process.cwd());

  recursive(tdir, [], function (err, files) {
    if (err) {
      console.error('Recursion error: ', err)
    }
    // Files is an array of filename
    // if (opts.debug)
    //   console.log(files);
    files.forEach(function (f) {
      const destf = f.replace('templates/', basedir)
      console.info(`${willDo}Templating file ${f} => ${destf}`)
      const t = fs.readFileSync(f, 'utf8')
      // if (opts.debug)
      //   console.log("template=",t);
      const tt = _.template(t)
      const variables = {
        version: pkg.version,
        publications: Object.keys(modules)
          .map((key) => `import '/imports/api/${key}/server/publications'`)
          .join('\n'),
        factoryImports: Object.keys(modules)
          .map((key) => `import './factory.${key}'`)
          .join('\n'),
        routeImports: Object.keys(modules)
          .map(
            (key) =>
              `import ${modules[key]}List from '/imports/ui/${key}/lister'`
          )
          .join('\n'),
        routeMarkup: Object.keys(modules)
          .map(
            (key) =>
              `<Route path="/admin/${key}" component={${modules[key]}List} />`
          )
          .join('\n'),
      }
      const buf = tt(variables)
      // if (opts.debug) {
      //   console.log(`${willDo}writing ${destf}`);
      // }
      if (!dry_run) fs.writeFileSync(destf, buf)
    })
    nextFunc() // Call the next step in this async world
  })
}

// export doTemplating

module.exports = doTemplating
