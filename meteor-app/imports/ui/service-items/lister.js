import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'
import List from './list'

const remove = id => Meteor.call('rm.ServiceItems', id)
const insert = form => Meteor.call('add.ServiceItems', form)
const update = form => Meteor.call('update.ServiceItems', form)
// Config data

const defaultObject = {
  name: 'Untitled',
  price: 0,
  code: 'XXX',
  category: 'Category',
  used: false
}

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, editable: true },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 140,
    editable: true,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD'
      }),
    valueParser: (value) => Math.round(parseFloat(value || 0) * 100)
  },
  { field: 'code', headerName: 'Code', width: 120, editable: true },
  { field: 'category', headerName: 'Category', flex: 1, editable: true },
  { field: 'used', headerName: 'Used', type: 'boolean', width: 110, editable: true }
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
