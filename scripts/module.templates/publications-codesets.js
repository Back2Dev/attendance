import { Meteor } from 'meteor/meteor'
import codesets from '../schema'
const cc = require('change-case')

//
// Non-templated code. relies on collections being added to default 'codesets' export
//
codesets.forEach(codeset => {
  Meteor.publish(`all.${codeset.name}`, () => {
    return codeset[collection].find({})
  })
})
