import React from 'react'
import { Card, Segment, Button, Menu, Input, Icon, Grid, Form, Header } from 'semantic-ui-react'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import Privacy, { SecurityModal } from './privacy'

const debug = require('debug')('b2b:checkout')
const NEED_DATE = 'paypal cash xero'.split(/\s+/)

const Checkout = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const [icon, setIcon] = React.useState('search')
  const [code, setCode] = React.useState('')
  const [promo, setPromo] = React.useState(null)
  const [method, setMethod] = React.useState('')
  const [showDate, setShowDate] = React.useState(false)
  const changeMethod = e => {
    setMethod(e.target.value)
    setShowDate(NEED_DATE.includes(e.target.value))
  }
  const checkPromo = async () => {
    setIcon('ellipsis horizontal')
    debug(`Checking promo code ${code}`)
    // dispatch({ type: 'get-promo', payload: code })
    const promo = (await Meteor.callAsync('getPromo', code)) || { status: `Promo code "${code}" not found` }
    setPromo(promo)
    setIcon('check')
  }

  if (!state.products || !state.products.length) {
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
          onChange={e => setCode(e.target.value)}
          labelPosition="right"
          name="promo"
        />
      </div>
      {promo && promo._id && (
        <div style={{ textAlign: 'center' }}>
          <Grid textAlign="center" columns={3}>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column>
                <Segment raised color="green" compact>
                  <Header as="h2" icon>
                    <Icon name="flag checkered" color="green" />
                    {promo.description}
                    <Header.Subheader>Select payment method</Header.Subheader>
                  </Header>
                  <Form>
                    <Form.Group grouped>
                      <Form.Field
                        label="Discount"
                        control="input"
                        type="radio"
                        name="method"
                        value="discount"
                        onChange={changeMethod}
                      />
                      {method === 'discount' && <Input name="discount" placeholder="Discount %" />}
                      <Form.Field
                        label="Send invoice by email"
                        control="input"
                        type="radio"
                        name="method"
                        value="email"
                        onChange={changeMethod}
                      />
                      {method === 'email' && <Input name="email" type="email" placeholder="Email" />}
                      <Form.Field
                        label="Paid via Paypal"
                        control="input"
                        type="radio"
                        name="method"
                        value="paypal"
                        onChange={changeMethod}
                      />
                      <Form.Field
                        label="Paid in Xero"
                        control="input"
                        type="radio"
                        name="method"
                        value="xero"
                        onChange={changeMethod}
                      />
                      <Form.Field
                        label="Paid in cash"
                        control="input"
                        type="radio"
                        name="method"
                        value="cash"
                        onChange={changeMethod}
                      />
                      {showDate && <Input name="date" placeholder="Date paid" />}
                      <Form.Field
                        label="Freebie"
                        control="input"
                        type="radio"
                        name="method"
                        value="freebie"
                        onChange={changeMethod}
                      />
                      <Form.Field
                        label="Charge to card"
                        control="input"
                        type="radio"
                        name="method"
                        value="charge"
                        onChange={changeMethod}
                      />
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>
        </div>
      )}
      {promo && promo.status && <span style={{ color: 'red' }}>{promo.status}</span>}
    </div>
  )
}

export default Checkout
