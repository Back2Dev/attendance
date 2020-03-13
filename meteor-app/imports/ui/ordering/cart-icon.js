import React from 'react'
import { Icon, Button, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

// Note - the first span should be a Link
const CartIcon = props => {
  const cartClick = () => {
    if (props.onClick) props.onClick()
  }
  return (
    <span to="/parts/ordering/cart">
      <Button as="div" labelPosition="right">
        <Button icon="cart" content={true ? 'Total items' : 'View Order'} primary onClick={cartClick} />
        <Label basic pointing="left">
          {props.noOfParts}
        </Label>
      </Button>
    </span>
  )
}
export default CartIcon
