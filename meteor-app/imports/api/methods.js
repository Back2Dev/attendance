// methods that affect both collections

import Roles from '/imports/api/roles/roles'
import Sessions from '/imports/api/sessions/sessions'
import moment from 'moment'

Meteor.methods({
  'signin'(roleId, duration = 6) {

    const timeIn = new Date()
    const timeOut = moment(timeIn).add(6, 'h').toDate()

    const newSessionId = Sessions
      .insert({
        roleId,
        timeIn,
        timeOut,
        duration,
      })

    Roles.update({
      _id: roleId,
    }, {
        $set: {
          isHere: true,
          lastIn: timeIn,
        },
        $push: { sessions: newSessionId }
      })


  },

  // signing out _isnt_ mandatory.
  // at end of each day every role will be automatically signed out.
  // if role does sign out early though, lets update timeOut and duration
  'signout'(id) {
    Roles.update(
      { _id: id },
      { $set: { 
        isHere: false,
        lastIn: new Date(),
       } }
    )
    // role may have signed in multiple times that day,
    // so lets find the LAST session of theirs from 12am TODAY
    const session = Sessions.find({
      roleId: id,
      timeIn: { $gte: moment().startOf('day').toDate() },
    }).fetch()
      .pop()

    // lets recalculate the duration of session
    let timeIn = moment(session.timeIn)
    let timeOut = moment()

    // update the anticipated duration with actual visit duration
    const duration =
      moment
        .duration(timeOut.diff(timeIn))
        .get('hours')

    Sessions.update({
      _id: session._id,
    }, {
        $set: {
          // convert timeOut from moment instance to native date object
          timeOut: timeOut.toDate(),
          duration,
        },
      })
  },
})