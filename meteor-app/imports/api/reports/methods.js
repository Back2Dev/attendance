/* You will need to modify the reports schema to add a `events` array, and each 
  element in the array should conform to a subschema. See https://github.com/aldeed/simple-schema-js for details.

  The subschema will need the following elements:

    * timestamp
    * type (string, one of "normal","section"
    * description
    * object (optional)

  ### Tests
  We need to write tests in `methods.test.js` to test these methods, and also to add additional tests in `schema.test.js`

  There is, however, a need to display report information in the UI. I will create another ticket for this.

  `report.push` will expect 4 parameters, the _id, a description an optional object and an optional type ("section" or "normal")
*/
import { Meteor } from 'meteor/meteor'
import Reports from './schema'
const debug = require('debug')('b2b:reports')

Meteor.methods({
  // `report.create` will expect a name parameter, and return the `_id` of the report record it creates
  'report.create'(report) {
    try {
      const id = Reports.insert(report)
      debug(`id ${id}`)

      return id
    } catch (e) {
      debug(`Error`, e)
      throw new Meteor.Error(500, e)
    }
  },
  // `report.push` will expect 4 parameters, the _id, a description an optional object and an optional type ("section" or "normal")

  'report.push'(id, description, object, type) {
    try {
      const event = { description, object, type, timestamp: new Date() }
      const n = Reports.update(id, { $push: { events: event } })
      if (n !== 1)
        throw new Meteor.Error('Update did not work')

    } catch (e) {
      debug(`Error`, e)
      throw new Meteor.Error(500, e)
    }
  }
})
