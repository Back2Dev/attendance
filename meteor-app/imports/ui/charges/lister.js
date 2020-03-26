import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import Charges from '/imports/api/charges/schema'
import List from './list'

const meteorCall = async (method, description, param) => {
  try {
    Alert.info(description || `Calling ${method}`)
    const s = await Meteor.callAsync(method, param)
    if (s.status === 'success') {
      Alert.success(s.message)
    } else {
      Alert.error(`Error ${s.message}`)
    }
  } catch (e) {
    Alert.error(`Error ${e.message}`)
  }
}

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
  { field: 'token', title: 'token', editor: true },
  { field: 'success', title: 'success', editor: true },
  { field: 'amount', title: 'amount', editor: true },
  { field: 'currency', title: 'currency', editor: true },
  { field: 'description', title: 'description', editor: true },
  { field: 'email', title: 'email', editor: true },
  { field: 'ip_address', title: 'ipAddress', editor: true },
  { field: 'created_at', title: 'createdAt', editor: true },
  { field: 'status_message', title: 'statusMessage', editor: true },
  { field: 'error_message', title: 'errorMessage', editor: true },
  { field: 'card', title: 'card', editor: true },
  { field: 'transfer', title: 'transfer', editor: true },
  { field: 'amount_refunded', title: 'amountRefunded', editor: true },
  { field: 'total_fees', title: 'totalFees', editor: true },
  { field: 'merchant_entitlement', title: 'merchantEntitlement', editor: true },
  { field: 'refund_pending', title: 'refundPending', editor: true },
  { field: 'authorisation_expired', title: 'authorisationExpired', editor: true },
  { field: 'captured', title: 'captured', editor: true },
  { field: 'captured_at', title: 'capturedAt', editor: true },
  { field: 'settlement_currency', title: 'settlementCurrency', editor: true },
  { field: 'active_chargebacks', title: 'activeChargebacks', editor: true },
  { field: 'metadata', title: 'metadata', editor: true }
]
const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}
export default withTracker(props => {
  const subsHandle = Meteor.subscribe('all.charges')
  return {
    items: Charges.find({}).fetch(),
    remove,
    update,
    insert,
    columns,
    defaultObject,
    loading: !subsHandle.ready()
  }
})(Loading)
