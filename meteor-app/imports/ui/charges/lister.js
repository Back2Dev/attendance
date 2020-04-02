import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import Charges from '/imports/api/charges/schema'
import {
  centFormatter,
  dateFormat,
  expiryFormatter,
  cardFormatter,
  objectFormatter
} from '/imports/ui/utils/formatters'
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
  code: 'XXX',
  reconciled: false,
  matched: false
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
  { field: 'created_at', title: 'Date', width: 80, formatter: 'datetime', formatterParams: dateFormat },
  { field: 'description', title: 'description', width: 80, headerFilter: 'input' },
  { field: 'success', title: 'success', formatter: 'tickCross', headerVertical: 'flip', align: 'center' },
  { field: 'matched', title: 'Matched', formatter: 'tickCross', headerVertical: 'flip', align: 'center' },
  {
    field: 'reconciled',
    title: 'Reconciled',
    formatter: 'tickCross',
    headerVertical: 'flip',
    editor: true,
    align: 'center'
  },
  {
    field: 'amount',
    title: 'amount',
    formatter: centFormatter,
    formatterParams: { decimals: 2 },
    headerFilter: 'input'
  },

  { field: 'email', title: 'email', headerFilter: 'input' },
  {
    field: 'card',
    title: 'Card details',
    columns: [
      { field: 'card.name', title: 'Name', headerFilter: 'input' },
      // { field: 'card.scheme', title: 'Type' },
      { field: 'card.display_number', title: 'Card', width: 80, formatter: cardFormatter }
      // { field: 'card.issuing_country', title: 'Country' },
      // { field: 'card.expiry_month', title: 'Expiry', formatter: expiryFormatter }
      // { field: 'card.address_line1', title: 'Address' }
    ]
  },
  { field: 'metadata', title: 'metadata', formatter: objectFormatter },
  // { field: 'token', title: 'token' },

  // { field: 'currency', title: 'currency' },
  // { field: 'status_message', title: 'statusMessage' },
  // { field: 'amount_refunded', title: 'amountRefunded' },
  // { field: 'total_fees', title: 'totalFees' },
  // { field: 'merchant_entitlement', title: 'merchantEntitlement' },
  // { field: 'refund_pending', title: 'refundPending' },
  // { field: 'authorisation_expired', title: 'authorisationExpired' },
  // { field: 'captured', title: 'captured' },
  // { field: 'captured_at', title: 'capturedAt' },
  // { field: 'settlement_currency', title: 'settlementCurrency' },
  // { field: 'active_chargebacks', title: 'activeChargebacks' },
  { field: 'error_message', title: 'errorMessage' }
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
