import Roles from './roles'

Meteor.methods({
  'role.checkin'(id){
    Roles.update({
      _id: id
    }, {
      $set : {isHere: true}
    })
  },
  'role.checkout'(id){
    Roles.update({
      _id: id
    }, {
      $set : {isHere: false}
    })
  }
})