import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'
import CartSummary from './cart-summary'

const mkid = name => name.toLowerCase().replace(/[\W+]/, '_')

const ProdTypeCard = props => {
  const go = () => {
    props.history.push(`/shop/type/${props.type}`)
  }
  return (
    <p key={props.type}>
      <Button id={mkid(props.name)} type="button" onClick={go} color={props.color} icon labelPosition="left">
        <Icon name={props.icon} />
        {props.name}
      </Button>
    </p>
  )
}

const ShopWindow = props => {
  const { productTypes, settings } = props
  return (
    <div>
      <h4>{settings.org} Shop</h4>
      <CartSummary history={props.history} />
      <p>{settings.tagline}</p>
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
  productTypes: PropTypes.array,
  settings: PropTypes.object.isRequired
}
export default ShopWindow
