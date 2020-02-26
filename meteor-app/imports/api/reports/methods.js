// You will need to modify the reports schema to add a `events` array, and each element in the array should conform to a subschema. See https://github.com/aldeed/simple-schema-js for details.

// The subschema will need the following elements:

//   * timestamp
//   * type (string, one of "normal","section"
//   * description
//   * object (optional)

// ### Tests
// We need to write tests in `methods.test.js` to test these methods, and also to add additional tests in `schema.test.js`

// There is, however, a need to display report information in the UI. I will create another ticket for this.

// `report.push` will expect 4 parameters, the _id, a description an optional object and an optional type ("section" or "normal")
import { Meteor } from 'meteor/meteor'
import Reports from './schema'
const debug = require('debug')('b2b:reports')

Meteor.methods({
  // `report.create` will expect a name parameter, and return the `_id` of the report record it creates
  'report.create'(name) {
    try {
      const id = Reports.insert({ name })
      debug(`id ${id}`)

      return id
    } catch (e) {
      log.error(e)
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
  // `report.push` will expect 4 parameters, the _id, a description an optional object and an optional type ("section" or "normal")

  // 'report.push'(id, description, optionalObject, optio) {
  // 	try {
  // 		const id = Reports.insert({ name })
  // 		return id
  // 	} catch (e) {
  // 		log.error(e)
  // 		throw new Meteor.Error(500, e.sanitizedError.reason)
  // 	}
  // }
})
