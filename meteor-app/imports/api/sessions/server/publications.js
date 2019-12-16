import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'
import Members from '/imports/api/members/schema'
import Events from '/imports/api/events/schema'
import moment from '../../../../node_modules/moment/moment'

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
})

Meteor.publish('memberSessions', date => {
  const eventQuery = {
    active: true,
    $or: [
      { type: 'day', days: moment(date).weekday() },
      {
        type: 'once',
        when: {
          $gte: moment(date)
            .startOf('day')
            .toDate(),
          $lte: moment(date)
            .endOf('day')
            .toDate()
        }
      }
    ]
  }
  return [
    Sessions.find({
      timeIn: {
        $gte: moment(date)
          .startOf('day')
          .toDate(),
        $lte: moment(date)
          .endOf('day')
          .toDate()
      }
    }),
    Members.find({}, { fields: { name: 1, _id: 1, avatar: 1 }, sort: { name: 1 } }),
    Events.find(eventQuery)
  ]
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
