/*
 GENERATED LIST HERE - Did it this way because we can't import anything here,
   as this isn't a regular JS file, it's just a package description,  and it's job
   is to define what the assets are that make up the package.
 */
const EXTRA_THINGS = [
  // 'triggers',
]
const things = ['users', 'roles'].concat(EXTRA_THINGS)

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
    const jsonFile = `json/${thing}.json`
    try {
      api.addAssets(jsonFile, 'server')
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
