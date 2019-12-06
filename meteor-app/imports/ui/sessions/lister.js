import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Events from '/imports/api/events/schema'
import List from './list'

const remove = id => Meteor.call('rm.Sessions', id)
const update = form => Meteor.call('update.Sessions', form)
const add = form => Meteor.call('add.Sessions', form)

const defaultObject = {
  memberid: 2,
  name: 'Name',
  duration: 0,
  timeIn: new Date(),
  timeOut: new Date(),
  price: 0
}

const columns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'memberName', title: 'Member Name', editor: true },
  { field: 'name', title: 'Name', editor: true },
  { field: 'duration', title: 'Duration', editor: true },
  { field: 'timeIn', title: 'timeIn', editor: DateEditor },
  { field: 'timeOut', title: 'timeOut', editor: DateEditor },
  { field: 'price', title: 'Price', editor: true }
]

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.sessions')
  const membersHandle = Meteor.subscribe('all.members')
  const eventsHandle = Meteor.subscribe('all.events')

  return {
    items: Sessions.find({}).fetch(),
    members: Members.find({}).fetch(),
    events: Events.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(List)
