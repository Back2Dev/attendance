import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/assessments/serviceItems'
import List from './list'

const remove = id => Meteor.call('rm.ServiceItems', id)
const insert = form => Meteor.call('add.ServiceItems', form)
const update = form => Meteor.call('update.ServiceItems', form)
// Config data

const defaultObject = {
  name: 'Untitled',
  markdown: 'Description'
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
  { field: 'price', title: 'Price', editor: true },
  { field: 'code', title: 'Code', editor: true },
  {
    field: 'category',
    title: 'Category',
    editor: true
  },
  { field: 'used', title: 'Used', editor: true }
]

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.serviceItems')
  return {
    items: ServiceItems.find({}).fetch(),
    remove,
    insert,
    update,
    loading: !subsHandle.ready(),
    defaultObject,
    columns
  }
})(Loading)
