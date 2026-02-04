import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import Charges from '/imports/api/charges/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'
import moment from 'moment'

const refresh = (id) => meteorCall('refresh.charges', 'Refreshing', id)
const remove = (id) => meteorCall('rm.charges', 'Deleting', id)
const update = (form) => meteorCall('update.charges', 'updating', form)
const insert = (form) => meteorCall('insert.charges', 'adding', form)

// Config data

const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX',
  reconciled: false,
  matched: false,
}
const columns = [
  {
    field: 'created_at',
    headerName: 'Date',
    type: 'dateTime',
    width: 160,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY h:mm A') : '')
  },
  { field: 'description', headerName: 'description', flex: 1 },
  { field: 'success', headerName: 'success', type: 'boolean', width: 110 },
  { field: 'matched', headerName: 'Matched', type: 'boolean', width: 110 },
  { field: 'reconciled', headerName: 'Reconciled', type: 'boolean', width: 120, editable: true },
  {
    field: 'amount',
    headerName: 'amount',
    type: 'number',
    width: 120,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  {
    field: 'total_fees',
    headerName: 'Fees',
    type: 'number',
    width: 120,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  {
    field: 'merchant_entitlement',
    headerName: 'Payable',
    type: 'number',
    width: 140,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  { field: 'email', headerName: 'email', width: 220 },
  { field: 'card_name', headerName: 'Card name', width: 160, valueGetter: (p) => p.row.card?.name || '' },
  {
    field: 'card_number',
    headerName: 'Card',
    width: 140,
    valueGetter: (p) => p.row.card?.display_number || ''
  },
  {
    field: 'metadata',
    headerName: 'metadata',
    flex: 1,
    valueFormatter: (params) => (params.value ? JSON.stringify(params.value) : '')
  },
  { field: 'error_message', headerName: 'errorMessage', flex: 1 }
]
const Loading = (props) => {
  if (props.loading) return <div>Loading</div>
  return <List {...props}></List>
}
export default withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.charges')
  return {
    items: Charges.find({}, { sort: { created_at: -1 } }).fetch(),
    remove,
    update,
    insert,
    refresh,
    columns,
    defaultObject,
    loading: !subsHandle.ready(),
  }
})(Loading)
