// The rest of this file is "standard"

Package.describe({
  name: 'fixtures',
  version: '1.5.0',
  // Brief, one-line summary of the package.
  summary: 'Scripts to load fixtures into DB',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
})

//
// This is run at build time, it's purpose is to load assets
//
Package.onUse(function (api) {
  api.versionsFrom('1.2.1')
  api.use('ecmascript')

  //
  // Loop through the things...
  //
  things.forEach(function (thing) {
    try {
      api.addAssets(thing + '.json', 'server')
    } catch (e) {
      console.error(e.message) // This way we get a warning when something fails to load, but it's not fatal
    }
  })

  api.addFiles('fixtures.js', 'server')
  api.export('Fixtures', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('fixtures')
  //  api.addFiles('gscripts-tests.js');
})
