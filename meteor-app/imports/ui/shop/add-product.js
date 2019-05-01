import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Image, Icon } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Checkout from './checkout'

const debug = require('debug')('b2b:shop')

const AddProduct = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const { product, member, loading } = props
  if (loading) return <div>Loading...</div>

  if (!product) {
    debug('No product !', props)
  } else {
  }
  // setTimeout(() => {
  //   dispatch({ type: 'reset-add', payload: product })
  // }, 500)

  return <Checkout />
}

export default AddProduct
