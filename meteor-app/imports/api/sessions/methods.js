import Sessions from './sessions'

Meteor.methods({
  'attendance.signin'(id) {
    // create a new attendance
    Sessions.insert({
      roleId: id,
      timeIn: Date.now(),
      timeOut: Date.now(),
    })
  },

  'attendance.signout'(id) {
    Sessions.update({
      roleId: id,
      timeIn: { $gte: Date.now() - 43200000 }
    }, {
        $set: { timeOut: Date.now() }
      })
  }
});