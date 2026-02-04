import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { escapeRegExp } from 'lodash'
import moment from 'moment'
import { Loader } from 'semantic-ui-react'

import { eventLog } from '/imports/api/eventlogs'
import { accessByPath } from '/imports/api/utils'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'
import Alert from '/imports/ui/utils/alert'
import CartList from './matching'
const debug = require('debug')('b2b:admin')

const columns = [
  {
    field: 'matched',
    headerName: 'Matched',
    type: 'boolean',
    width: 110,
    valueGetter: (params) => Boolean(params.row.memberId),
    align: 'center',
    headerAlign: 'center'
  },
  {
    headerName: 'Date',
    field: 'createdAt',
    type: 'dateTime',
    width: 170,
    valueGetter: (params) => (params.value ? new Date(params.value) : null),
    valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YY hh:mm a') : '')
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 120
  },
  {
    headerName: 'Name',
    field: 'customerName',
    width: 200
  },
  {
    headerName: 'Email',
    field: 'email',
    width: 220
  },
  {
    headerName: 'Amount',
    field: 'amount',
    type: 'number',
    width: 140,
    valueFormatter: (params) =>
      (params.value / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
  },
  {
    headerName: 'Items',
    field: 'codes',
    flex: 1
  },
  {
    headerName: 'Payment email',
    field: 'email',
    width: 220
  },
  {
    headerName: 'Payment name',
    field: 'name',
    width: 200
  },
  {
    headerName: 'payment address',
    field: 'address',
    width: 220
  },
]

const MatchingLoader = (props) => {
  if (props.loading) return <Loader>Loading</Loader>
  return <CartList {...props} />
}

const fixers = {
  amount: 'chargeResponse.amount',
  codes: 'chargeResponse.metadata.codes',
  email: 'chargeResponse.email',
  name: 'creditCard.name',
  address: 'creditCard.address_line1',
}

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members.carts')
  const loading = !membersHandle.ready()

  const filter = (query) => {
    const searching = query != ''
    if (searching) {
      return {
        name: {
          $regex: new RegExp(escapeRegExp(query)),
          $options: 'i',
        },
      }
    } else {
      return {}
    }
  }

  const members = Members.find(filter(Session.get('searchQuery')), {
    sort: {
      createdAt: -1,
    },
  }).fetch()

  const carts = Carts.find(
    {},
    {
      sort: {
        createdAt: -1,
      },
    }
  )
    .fetch()
    .map((cart) => {
      Object.keys(fixers).forEach((col) => {
        cart[col] = accessByPath(cart, fixers[col])
      })
      return cart
    })

  const purchases = Purchases.find(
    {},
    {
      sort: {
        createdAt: -1,
      },
    }
  ).fetch()

  const memberWord = Meteor.settings.public.member || 'Volunteer'
  const memberWords = memberWord + 's'

  const removeCart = (id) => {
    const cart = Carts.findOne(id)
    Meteor.call('cart.remove', id, (err, res) => {
      if (err) {
        Alert.error(`error whilst removing cart: ${err.message} `)
      } else {
        Alert.success(`successfully removed ${res} cart`)
        eventLog({
          who: 'Admin',
          what: `removed cart id: ${id}`,
          object: cart,
        })
      }
    })
  }

  const reconcile = (id) => {
    const cart = Carts.findOne(id)
    Meteor.call('reconcileCompletedCarts', id, (err, res) => {
      if (err) {
        Alert.error(`Error whilst reconciling cart: ${err.message} `)
      } else {
        Alert.success(res.message)
        eventLog({
          who: 'Admin',
          what: `removed cart id: ${id}`,
          object: cart,
        })
      }
    })
  }

  const extendMember = async (memberId, purchaseId) => {
    const member = Members.findOne(memberId)
    const when = prompt(
      `Extend membership for ${member.name} to (DD/MM/YYYY)`
    )
    if (when) {
      const isoWhen = moment(when, 'DD/MM/YYYY').format('YYYY-MM-DD')
      Meteor.call(
        'purchase.extend',
        memberId,
        purchaseId,
        isoWhen,
        (err, res) => {
          if (err) {
            Alert.error('error whilst extending member')
          } else {
            Alert.success(
              `successfully extended ${res} membership to ${isoWhen}`
            )
            eventLog({
              who: 'Admin',
              what: `extended member id: ${memberId} to ${isoWhen}`,
              object: member,
            })
          }
        }
      )
    }
  }

  return {
    loading,
    members,
    carts,
    purchases,
    extendMember,
    reconcile,
    remove: removeCart,
    memberWords,
    columns,
  }
})(MatchingLoader)
