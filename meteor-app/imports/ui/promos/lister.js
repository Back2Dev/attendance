import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Promos from '/imports/api/promos/schema'
import List from './list'
import moment from 'moment'

const remove = id => Meteor.call('rm.Promos', id)
const update = form => Meteor.call('update.Promos', form)
const add = form => Meteor.call('add.Promos', form)

const defaultObject = {
  code: 'Code',
  description: 'Description',
  discount: 0,
  admin: false,
  start: new Date()
}

const columns = [
  { field: 'code', headerName: 'Code', flex: 1, editable: true },
  { field: 'description', headerName: 'Description', flex: 1, editable: true },
  {
    field: 'discount',
    headerName: 'Discount(%)',
    type: 'number',
    width: 140,
    editable: true
  },
  { field: 'admin', headerName: 'Admin', type: 'boolean', width: 110, editable: true },
  {
    field: 'start',
    headerName: 'Start',
    type: 'date',
    width: 140,
    editable: true,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY') : '')
  },
  {
    field: 'expires',
    headerName: 'Expires',
    type: 'date',
    width: 140,
    editable: true,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY') : '')
  }
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
