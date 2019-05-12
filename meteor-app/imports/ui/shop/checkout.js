import React from 'react'
import {
  Card,
  Segment,
  Button,
  Menu,
  Modal,
  Header,
  Icon
} from 'semantic-ui-react'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import Privacy from './privacy'

const Checkout = props => {
  const { state, dispatch } = React.useContext(CartContext)
  if (!state.products.length) {
    return (
      <div>
        <h4>Checkout </h4>
        <Segment raised color='red'>
          <p>You have nothing in your shopping cart</p>
          <Button
            type='button'
            primary
            onClick={() => props.history.push('/shop')}
          >
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
          <Modal trigger={<Button>Privacy statement</Button>} closeIcon>
            <Modal.Content image>
              <Modal.Description>
                <Header>Privacy</Header>
                <Privacy />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Menu.Item>
        <Menu.Item position='right'>
          <Button
            type='button'
            color='green'
            floated='right'
            onClick={() => props.history.push('/shop/address')}
          >
            Buy now
          </Button>
        </Menu.Item>
      </Menu>
      <Segment>
        <Card.Group centered>
          {state.products.map(p => {
            return <ProductCard {...p} key={p._id} mode='remove' />
          })}
        </Card.Group>
      </Segment>
      <Button
        type='button'
        color='green'
        floated='right'
        onClick={() => props.history.push('/shop/address')}
      >
        Buy now
      </Button>
    </div>
  )
}

export default Checkout
