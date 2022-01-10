/* global Roles */
const cc = require('change-case')
const debug = require('debug')('app::fixtures')

// Default config object - this gets overridden by the file /server/fixtures.js
Dba = {
  data: {},
  config: {
    debug: false,
  },
}

Dba.loadAssets = function (items) {
  items.forEach(function (thing) {
    const jsonFile = `json/${thing}.json`
    try {
      Dba.data[thing] = JSON.parse(Assets.getText(jsonFile))
    } catch (e) {
      // Does it look like a plain text file?
      const names = Assets.getText(jsonFile).split(/\n/)
      if (names.length) {
        Dba.data[thing] = names.map((name) => {
          return { name }
        })
      } else console.error(`Error parsing JSON data file: ${jsonFile}\n  - error message is : '${e.message}'`)
    }
  })
}
