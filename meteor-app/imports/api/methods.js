// methods that affect both collections

import Roles from '/imports/api/roles/roles'
import Sessions from '/imports/api/sessions/sessions'

Meteor.methods({

  'signin'(id) {
    Roles.update({
      _id: id
    }, {
        $set: { isHere: true }
      })

    Sessions.insert({
      roleId: id,
      timeIn: Date.now(),
      timeOut: Date.now(),
    })

  },
  'signout'(id) {
    Roles.update({
      _id: id
    }, {
        $set: { isHere: false }
      })

    Sessions.update({
      roleId: id,
      timeIn: { $gte: Date.now() - 43200000 }
    }, {
        $set: { timeOut: Date.now() }
      })
  }
})