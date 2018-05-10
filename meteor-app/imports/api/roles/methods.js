import Roles from './roles'

Meteor.methods({
  'role.checkin'(id){
    Roles.update({
      _id: id
    }, {
      $set : {checkedin: true}
    })
  },
  'role.checkout'(id){
    Roles.update({
      _id: id
    }, {
      $set : {checkedin: false}
    })
  }
})