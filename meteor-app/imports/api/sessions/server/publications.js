import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'
import Members from '/imports/api/members/schema'
import Events from '/imports/api/events/schema'
import moment from '../../../../node_modules/moment/moment'

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
})

Meteor.publish('sessions.date', date => {
  return Sessions.find({
    timeIn: {
      $gte: moment(date)
        .startOf('day')
        .toDate(),
      $lte: moment(date)
        .endOf('day')
        .toDate()
    }
  })
})

Meteor.publish('membersEvents', () => {
  return [Members.find({}), Events.find({})]
})

Meteor.publish('session', id => {
  return Sessions.findOne(id)
})

Meteor.methods({
  'rm.Sessions': id => {
    Sessions.remove(id)
  },
  'update.Sessions': form => {
    const id = form._id
    delete form._id
    Sessions.update(id, { $set: form })
  },
  'add.Sessions': form => {
    Sessions.insert(form)
  }
})
