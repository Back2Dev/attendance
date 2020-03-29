import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import Charges from '/imports/api/charges/schema'
import { centFormatter, dateFormat, expiryFormatter, objectFormatter } from '/imports/ui/utils/formatters'
import { meteorCall } from '/imports/ui/utils/meteor'
import List from './list'

const refresh = id => meteorCall('refresh.charges', 'Refreshing', id)
const remove = id => meteorCall('rm.charges', 'Deleting', id)
const update = form => meteorCall('update.charges', 'updating', form)
const insert = form => meteorCall('insert.charges', 'adding', form)

// Config data

const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  code: 'XXX'
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
  { field: 'created_at', title: 'Date', formatter: 'datetime', formatterParams: dateFormat },
  { field: 'description', title: 'description' },
  { field: 'success', title: 'success', formatter: 'tickCross' },
  { field: 'error_message', title: 'errorMessage' },
  { field: 'amount', title: 'amount', formatter: centFormatter, formatterParams: { decimals: 2 } },
  {
    field: 'card',
    title: 'Card details',
    columns: [
      { field: 'card.name', title: 'Name' },
      { field: 'card.scheme', title: 'Type' },
      { field: 'card.display_number', title: 'Card' },
      // { field: 'card.issuing_country', title: 'Country' },
      { field: 'card.expiry_month', title: 'Expiry', formatter: expiryFormatter }
      // { field: 'card.address_line1', title: 'Address' }
    ]
  },
  // { field: 'token', title: 'token' },

  { field: 'currency', title: 'currency' },
  { field: 'email', title: 'email' },
  // { field: 'status_message', title: 'statusMessage' },
  { field: 'amount_refunded', title: 'amountRefunded' },
  { field: 'total_fees', title: 'totalFees' },
  // { field: 'merchant_entitlement', title: 'merchantEntitlement' },
  // { field: 'refund_pending', title: 'refundPending' },
  // { field: 'authorisation_expired', title: 'authorisationExpired' },
  // { field: 'captured', title: 'captured' },
  // { field: 'captured_at', title: 'capturedAt' },
  // { field: 'settlement_currency', title: 'settlementCurrency' },
  // { field: 'active_chargebacks', title: 'activeChargebacks' },
  { field: 'metadata', title: 'metadata', formatter: objectFormatter }
]
const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.charges')
  return {
    items: Charges.find({}, { sort: { created_at: -1 } }).fetch(),
    remove,
    update,
    insert,
    refresh,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
