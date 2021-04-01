import { Meteor } from 'meteor/meteor'

// schoolId is optional arg, used to limit scope if admin is searching within a school
export function search(query, sId) {
  if (!query) {
    throw new Meteor.Error('No query supplied')
  }
}

Meteor.methods({
  search(name, schoolId) {
    return search(name, schoolId)
  },
})
