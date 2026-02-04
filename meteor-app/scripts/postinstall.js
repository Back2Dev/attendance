const fs = require('fs')
const path = require('path')

function ensureJsonSchemaMergeLib() {
  const pkgRoot = path.join(__dirname, '..', 'node_modules', '@x0k', 'json-schema-merge')
  const distLib = path.join(pkgRoot, 'dist', 'lib')
  const libDir = path.join(pkgRoot, 'lib')

  if (!fs.existsSync(pkgRoot)) {
    return
  }

  if (!fs.existsSync(distLib)) {
    return
  }

  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true })
  }

  // Copy dist/lib/* -> lib/* to satisfy Meteor's legacy resolution.
  fs.cpSync(distLib, libDir, { recursive: true })
}

ensureJsonSchemaMergeLib()
