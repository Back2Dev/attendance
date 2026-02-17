import React, { useState, useCallback } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { cloneDeep } from 'lodash'
import { Carts } from '/imports/api/products/schema'
import Members from '/imports/api/members/schema'
import ShopFront from './shop-front'

const debug = require('debug')('b2b:shop')

const getPromo = async code => {
  return await Meteor.callAsync('getPromo', code)
}

const cartUpdate = data => {
  try {
    const contents = cloneDeep(data)
    const id = contents._id
    if (id) {
      delete contents._id
      debug(`Saving cart id ${id}`)
      Carts.update(id, { $set: { ...contents } })
    } else {
      const id = Carts.insert(contents)
      debug(`New cart id is ${id}`)
      sessionStorage.setItem('mycart', id)
      data._id = id // Remember to save the id back to the data
      return id
    }
  } catch (e) {
    console.error(`Error: [${e.message}] encountered while saving shopping cart`)
  }
}

const chargeCard = async ({ price, email, customer_token, metadata }) => {
  try {
    /* Submit the payment  */
    debug('Charging credit card')
    const packet = {
      amount: price.toString(),
      currency: 'AUD',
      description: 'Purchase',
      email,
      customer_token,
      metadata
    }

    const result = await Meteor.callAsync('makePayment', packet)
    if (typeof result === 'string' && (result.match(/^Request failed/i) || result.match(/error/i))) {
      debug('Response', result)
      return { error: result }
    } else {
      return result
    }
  } catch (err) {
    debug(`Error $err.message`, err)
    return { error: err.message }
  }
}

const ShopIndex = props => {
  const [cartId, setCartId] = useState(sessionStorage.getItem('mycart'))
  const [memberId, setMemberId] = useState(sessionStorage.getItem('memberId'))

  const { cart, member, loading, settings } = useTracker(() => {
    document.title = `${Meteor.settings.public.org} - shop`
    debug(`Cart id is ${cartId}`)
    const cartSub = Meteor.subscribe('cart', cartId, memberId)
    return {
      cart: Carts.findOne(cartId),
      member: Members.findOne(memberId),
      loading: !cartSub.ready(),
      settings: Meteor.settings.public
    }
  }, [cartId, memberId])

  const wrappedCartUpdate = useCallback(data => {
    const result = cartUpdate(data)
    const newCartId = sessionStorage.getItem('mycart')
    const newMemberId = sessionStorage.getItem('memberId')
    if (newCartId !== cartId) setCartId(newCartId)
    if (newMemberId !== memberId) setMemberId(newMemberId)
    return result
  }, [cartId, memberId])

  return (
    <ShopFront
      cart={cart}
      member={member}
      loading={loading}
      settings={settings}
      cartUpdate={wrappedCartUpdate}
      chargeCard={chargeCard}
      getPromo={getPromo}
      {...props}
    />
  )
}

export default ShopIndex
