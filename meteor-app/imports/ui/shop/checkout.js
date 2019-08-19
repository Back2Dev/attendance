import React from 'react'
import { Card, Segment, Button, Menu, Input } from 'semantic-ui-react'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import Privacy, { SecurityModal } from './privacy'

const Checkout = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const [icon, setIcon] = React.useState('search')
  const [promo, setPromo] = React.useState('')

  const checkPromo = () => {
    setIcon('ellipsis horizontal')
    console.log(`Checking promo code ${promo}`)
    setIcon('check')
  }

  if (!state.products.length) {
    return (
      <div>
        <h4>Checkout </h4>
        <Segment raised color="red">
          <p>You have nothing in your shopping cart</p>
          <Button type="button" primary onClick={() => props.history.push('/shop')}>
            Continue shopping
          </Button>
        </Segment>
      </div>
    )
  }
  return (
    <div>
      <Menu>
        <Menu.Item>
          <h2>Checkout </h2>
        </Menu.Item>
        <Menu.Item>
          <Privacy />
        </Menu.Item>
        <Menu.Item>
          <SecurityModal />
        </Menu.Item>
        <Menu.Item position="right">
          <Button type="button" color="green" floated="right" onClick={() => props.history.push('/shop/address')}>
            Buy now {!state._id && '!'}
          </Button>
        </Menu.Item>
      </Menu>
      <Segment>
        <Card.Group centered>
          {state.products.map(p => {
            return <ProductCard {...p} key={p._id} mode="remove" />
          })}
        </Card.Group>
      </Segment>

      <div style={{ textAlign: 'center' }}>
        <Button type="button" primary onClick={() => props.history.push('/shop/type/membership')}>
          Continue shopping
        </Button>
        <Button
          type="button"
          color="green"
          style={{ marginLeft: '16px' }}
          onClick={() => props.history.push('/shop/address')}
        >
          Buy now {!state._id && '!'}
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Input
          action={<Button color="teal" onClick={checkPromo} content="Check" />}
          iconPosition="left"
          icon={icon}
          placeholder="Promo code"
          onChange={e => setPromo(e.target.value)}
          labelPosition="right"
          name="promo"
        />
      </div>
    </div>
  )
}

export default Checkout
