import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Parts from '/imports/api/parts/schema'
import List from './list'

const remove = id => Meteor.call('rm.Parts', id)
const update = form => Meteor.call('update.Parts', form)
const insert = form => Meteor.call('add.Parts', form)

const defaultObject = {
  imageUrl: 'Enter a URL',
  retailPrice: 0,
  wholesalePrice: 0,
  partNo: 0,
  name: 'Untitled'
}

const columns = [
  { field: 'partNo', headerName: 'Part No', width: 120, editable: true },
  { field: 'name', headerName: 'Name', flex: 1, editable: true },
  { field: 'status', headerName: 'Status', width: 120, editable: true },
  { field: 'active', headerName: 'Active', type: 'boolean', width: 110, editable: true },
  {
    field: 'retailPrice',
    headerName: 'Retail Price',
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
  {
    field: 'wholesalePrice',
    headerName: 'Wholesale Price',
    type: 'number',
    width: 160,
    editable: true,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }),
    valueParser: (value) => Math.round(parseFloat(value || 0) * 100)
  },
  { field: 'barcode', headerName: 'Barcode', width: 150, editable: true },
  { field: 'imageUrl', headerName: 'Image Url', flex: 1, editable: true }
]

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.parts')
  return {
    items: Parts.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
