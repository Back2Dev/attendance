#!/usr/local/bin/node
'use strict'

const _ = require('lodash') // Used for templating
const moment = require('moment')
const fs = require('fs')
const recursive = require('recursive-readdir')
const { titleCase } = require('title-case')
const debug = require('debug')('app:templating')

//
// We now do some templating of key config files
//
function doTemplating(pkg, dry_run, folder, tdir, willDo, omit, nextFunc) {
  const basedir = process.cwd() + `/${folder}/`
  debug({ dry_run, folder, tdir, willDo, omit, nextFunc, basedir })
  const prog = process.argv.length > 1 ? process.argv[1] : process.argv[0]
  // This file contains the list of targets that can be built
  const modules = require(`../${folder}/imports/api/admin-items`)
  modules.forEach((m) => {
    m.collection = titleCase(m.id).replace(/-/g, '')
  })
  // debug(modules)

  // if (opts.debug)
  // 	console.log("cwd="+process.cwd());

  recursive(tdir, [], function (err, files) {
    if (err) {
      console.error('Recursion error: ', err)
    }
    // Files is an array of filename
    // if (opts.debug)
    //   console.log(files);
    files
      .filter((f) => !f.match(omit))
      .forEach(function (f) {
        const destf = f.replace('scripts/generator-templates/', basedir)
        console.info(`${willDo}Templating file ${f} => ${destf}`)
        const t = fs.readFileSync(f, 'utf8')
        // if (opts.debug)
        //   console.log("template=",t);
        const tt = _.template(t)
        const variables = {
          prog,
          when: moment().format('DD-MM-YYYY HH:MM:SS'),
          version: pkg.version,
          publications: modules
            .filter((m) => m.pubs)
            .map((m) => `import '/imports/api/${m.id}/server/publications'`)
            .join('\n'),
          adminItems: modules
            .filter((m) => m.menu)
            .map((m) => `  { display: '${m.menu}', link: '/admin/${m.id}' },`)
            .join('\n'),
          factoryImports: modules
            .filter((m) => !('factory' in m) || m.factory)
            .map((m) => `import './factory.${m.id}'`)
            .join('\n'),
          routeImports: modules
            .filter((m) => m.menu || m.route)
            .map(
              (m) =>
                `const ${m.collection} = lazy(() => import('/imports/ui/admin/${m.id}'))`
            )
            .join('\n'),
          routeMarkup: modules
            .filter((m) => m.menu || m.route)
            .map((m) => `<Route path="/admin/${m.id}" component={${m.collection}} />`)
            .join('\n'),
          // Not sure where to get fixtures from
          // EXTRA_THINGS: JSON.stringify(fixtures, null, 2),
        }
        // debug(variables)
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
