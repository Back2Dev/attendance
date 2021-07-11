// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const accessByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

module.exports = (on, config) => {
  // Pull in some environment values from the Meteor settings file
  const meteorSettings = require(`${process.cwd()}/dev.settings.json`)

  if (meteorSettings) {
    const mapper = { bucket: 'private.UPLOAD_BUCKET' }
    Object.keys(mapper).forEach((key) => {
      config.env[key] = accessByPath(meteorSettings, mapper[key])
      // console.log(`${key} => ${config.env[key]}`)
    })
  }

  // do not forget to return the changed config object!
  // console.log({ config })
  return config
}
