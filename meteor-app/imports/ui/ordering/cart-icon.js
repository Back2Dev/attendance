import React from 'react'
import { Icon, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
const CartIcon = (props) => (
    <Link to="/ordering/cart">
    <Button primary animated='vertical'>
      <Button.Content hidden>View Order</Button.Content>
      <Button.Content visible>
        <Icon name='cart' size='big' />
        <Icon size='large'>{props.noOfParts}</Icon> 
      </Button.Content>
    </Button>
    </Link>
  )
  
  export default CartIcon 