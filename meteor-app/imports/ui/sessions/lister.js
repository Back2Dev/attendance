import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Sessions from '/imports/api/sessions/schema'
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
  { field: 'name', title: 'Name', editor: true },
  { field: 'duration', title: 'Duration', editor: true },
  { field: 'timeIn', title: 'timeIn', editor: true, validator: 'integer' },
  { field: 'timeOut', title: 'timeOut', editor: true },
  { field: 'price', title: 'Price', editor: true }
]

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.sessions')
  return {
    items: Sessions.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(List)
