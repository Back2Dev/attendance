import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Products from '/imports/api/products/schema'
import List from './list'
import moment from 'moment'

const remove = id => Meteor.call('rm.Products', id)
const update = form => Meteor.call('update.Products', form)
const insert = form => Meteor.call('insert.Products', form)

// Config data
const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX',
  type: 'membership',
  active: true
}

const typeOptions = {
  pass: 'Pass',
  membership: 'Membership',
  course: 'Course'
}

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, editable: true },
  { field: 'description', headerName: 'Description', flex: 1, editable: true },
  { field: 'code', headerName: 'Code', width: 110, editable: true },
  {
    field: 'type',
    headerName: 'Type',
    type: 'singleSelect',
    width: 140,
    editable: true,
    valueOptions: Object.keys(typeOptions)
  },
  { field: 'subsType', headerName: 'Subs type', width: 140, editable: true },
  { field: 'duration', headerName: 'Duration(months)', type: 'number', width: 170, editable: true },
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
  { field: 'qty', headerName: 'Qty', type: 'number', width: 110, editable: true },
  { field: 'image', headerName: 'Image', width: 160, editable: true },
  { field: 'active', headerName: 'Active', type: 'boolean', width: 110, editable: true },
  { field: 'autoRenew', headerName: 'Auto renew', type: 'boolean', width: 130, editable: true },
  {
    field: 'startDate',
    headerName: 'Start date',
    type: 'date',
    width: 140,
    editable: true,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY') : '')
  },
  {
    field: 'endDate',
    headerName: 'End date',
    type: 'date',
    width: 140,
    editable: true,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY') : '')
  }
]

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.products')
  return {
    items: Products.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
