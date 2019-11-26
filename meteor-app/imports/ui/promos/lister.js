import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import Promos from '/imports/api/promos/schema'
import List from './list'

const remove = id => Meteor.call('rm.Promos', id)
const update = form => Meteor.call('update.Promos', form)
const add = form => Meteor.call('add.Promos', form)

const defaultObject = {
  code: 'Code',
  description: 'Description',
  discount: 0,
  admin: 'Admin'
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
  { field: 'code', title: 'Code', editor: true },
  { field: 'description', title: 'Description', editor: true },
  { field: 'discount', title: 'Discount', editor: true, validator: 'integer' },
  { field: 'admin', title: 'Admin', editor: true },
  { field: 'start', title: 'Start', editor: DateEditor },
  { field: 'expires', title: 'Expires', editor: DateEditor }
]

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.promos')
  return {
    items: Promos.find({}).fetch(),
    remove,
    update,
    add,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(List)
