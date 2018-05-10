import Attendances from './attendances'

Meteor.methods({
  'attendance.signin'(id) {
    // create a new attendance
    Attendances.insert({
      roleId: id,
      timeIn: Date.now(),
      timeOut: Date.now(),
    })
  },

  'attendance.signout'(id) {
    Attendances.update({
      roleId: id,
      timeIn: { $gte: Date.now() - 43200000 }
    }, {
        $set: { timeOut: Date.now() }
      })
  }
});