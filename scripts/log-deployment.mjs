#!/bin/node
import fs from 'fs'
import { DateTime } from 'luxon'
import git from 'git-rev'
import { myrequireJSON, importJS } from './mjslib/util.mjs'

// Read the mup.js file to get config information
const doit = async () => {
  try {
    const mupFile = process.cwd() + '/mup.js'
    let pkgFile = process.cwd() + `/package.json`
    let ROOT_URL = process.env.API_URL
    let PATH = process.cwd()
    let mupLogFile = process.cwd() + '/deploy.log'
    if (fs.existsSync(mupFile)) {
      const m = await importJS(mupFile)
      pkgFile = process.cwd() + `/${m.app.path}/package.json`
      ROOT_URL = m.app.env.ROOT_URL
      PATH = m.app.path
    }
    // console.log(process.argv)
    // Remove the first 2 arguments
    process.argv.shift()
    process.argv.shift()
    const action = process.argv.pop()
    process.argv.pop()
    const pkg = myrequireJSON(pkgFile) // eslint-disable-line global-require
    // Bump the version number only when deploying
    if (action === 'deploy') {
      // Bump the version in package.json
      const [major, minor, patch] = pkg.version.split('.')
      pkg.version = [major, minor, parseInt(patch) + 1].join('.')
      pkg.versionDate = DateTime.now().toFormat('ccc d LLL, yyyy')
      fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2), { encoding: 'utf8' })
    }
    // Append to the mup log file
    git.branch((branch) => {
      fs.appendFileSync(
        mupLogFile,
        `${process.argv.join(' ')} ${action} ${branch} ${ROOT_URL} ${pkg.version}\n`
      )
    })
  } catch (e) {
    console.error(e)
  }
}

doit()
