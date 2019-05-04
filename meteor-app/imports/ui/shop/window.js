import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import productTypes from './building'
import { Button, Icon } from 'semantic-ui-react'
import CartSummary from './cart-summary'

const ProdTypeCard = props => {
  const go = () => {
    props.history.push(`/shop/${props.type}`)
  }
  return (
    <p key={props.type}>
      <Button type="button" onClick={go} color={props.color} icon labelPosition="left">
        <Icon name={props.icon} />
        {props.name}
      </Button>
    </p>
  )
}

const ShopWindow = props => {
  const { productTypes, org, tagline } = props
  return (
    <div>
      <h4>{org} Shop</h4>
      <CartSummary history={props.history} />
      <p>{tagline}</p>
      {props.loading && <span>Loading...</span>}
      {!props.loading &&
        productTypes &&
        productTypes.length &&
        productTypes.map(prodType => <ProdTypeCard key={prodType.type} history={props.history} {...prodType} />)}
    </div>
  )
}

ShopWindow.propTypes = {
  loading: PropTypes.bool.isRequired,
  productTypes: PropTypes.array
}
export default ShopWindow
