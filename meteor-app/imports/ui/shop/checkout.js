import React from 'react'
import { Card, Segment, Button, Menu, Label, Input, Icon, Grid, Form, Header } from 'semantic-ui-react'
import Alert from 'react-s-alert'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import Privacy, { SecurityModal } from './privacy'

const debug = require('debug')('b2b:checkout')
const NEED_DATE = 'paypal cash xero'.split(/\s+/)

const Checkout = ({ history }) => {
  const { state, dispatch } = React.useContext(CartContext)
  const [icon, setIcon] = React.useState('search')
  const [code, setCode] = React.useState('')
  const [promo, setPromo] = React.useState(null)
  const [member, setMember] = React.useState(null)
  const [method, setMethod] = React.useState('')
  const [showDate, setShowDate] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [discountedPrice, setDP] = React.useState(state.price / 100)

  const adminCancel = () => {
    setPromo({ status: 'Please enter a discount code' })
    setIcon('meh outline')
  }

  const adminDoIt = async () => {
    try {
      switch (method) {
        case 'email':
          // Send an email containing the cart
          const status = await Meteor.callAsync(
            'member.email.invoice',
            state._id,
            email,
            discountedPrice * 100,
            state.discount
          )
          sessionStorage.removeItem('myCart')
          sessionStorage.removeItem('name')
          Alert.info(`Sent invoice to ${email}`)
          history.push(`/shop/sent/${email}`)
          break
        case 'charge':
          // Go to the Charge my card page...
          history.push(`/shop/charge/${member._id}/${state._id}`)
          break
        // it's paid already
        case 'paypal':
        case 'xero':
        case 'cash':
          history.push('/shop/paid/${member._id}')

          break
        default:
          break
      }
    } catch (e) {
      console.error(`Something went wrong ${e.message}`)
    }
  }

  const changeMethod = e => {
    setMethod(e.target.value)
    setShowDate(NEED_DATE.includes(e.target.value))
  }

  const changeDiscount = e => {
    state.discount = e.target.value
    if (e.target.value.match(/^\$\d+/)) {
      const disc = parseInt(e.target.value.replace('$', ''))
      setDP(state.price / 100 - disc)
    } else {
      const disc = parseInt(e.target.value)
      if (disc) {
        setDP(Math.floor(((100 - disc) * (state.price / 100)) / 100))
      } else setDP(state.price / 100)
    }
  }
  const checkPromo = async () => {
    setIcon('ellipsis horizontal')
    debug(`Checking promo code ${code}`)
    // dispatch({ type: 'get-promo', payload: code })
    if (code) {
      const { promo, member } = await Meteor.callAsync(
        'getPromo',
        code,
        sessionStorage.getItem('memberId') || state.memberId
      )
      if (!promo) {
        setPromo({
          status: `Promo code "${code}" not found`
        })
        setIcon('cancel')
      } else {
        debug('Promo', promo, member)
        setPromo(promo)
        setMember(member)
        setEmail(member.email)
        setIcon('check')
      }
    } else {
      setPromo({ status: 'Please enter a discount code' })
      setIcon('meh outline')
    }
  }

  if (!state.products || !state.products.length) {
    return (
      <div>
        <h4>Checkout </h4>
        <Segment raised color="red">
          <p>You have nothing in your shopping cart</p>
          <Button id="continue" type="button" primary onClick={() => history.push('/shop')}>
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
          <Button
            type="button"
            color="green"
            floated="right"
            id="menu_buy_now"
            onClick={() => history.push('/shop/address')}
          >
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
        <Button id="continue" type="button" primary onClick={() => history.push('/shop/type/membership')}>
          Continue shopping
        </Button>
        <Button
          type="button"
          color="green"
          style={{ marginLeft: '16px' }}
          onClick={() => history.push('/shop/address')}
          id="buy_now"
        >
          Buy now {!state._id && '!'}
        </Button>
        <Input
          style={{ float: 'right' }}
          action={<Button id="check" color="teal" onClick={checkPromo} content="Check" />}
          iconPosition="left"
          icon={icon}
          placeholder="Promo code"
          onChange={e => setCode(e.target.value)}
          labelPosition="right"
          name="promo"
        />
      </div>
      <div style={{ textAlign: 'center' }} />
      {promo && promo.discount && !promo.admin && (
        <Header style={{ textAlign: 'center' }}>
          <Icon name="flag checkered" color="green" style={{ display: 'inline' }} />
          Yay! You found...
          <br />
          {promo.description}
          <br />
          Click on "Buy Now" to make use of your discount
        </Header>
      )}
      {promo && promo._id && promo.admin && (
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
                      <Label>Charge: ${discountedPrice}</Label>
                      <br />
                      <Input name="discount" onChange={changeDiscount} placeholder="Discount % or $" />
                      {member && member.paymentCustId && (
                        <Form.Field
                          label="&nbsp; Charge to credit card"
                          control="input"
                          type="radio"
                          name="method"
                          value="charge"
                          onChange={changeMethod}
                        />
                      )}
                      <Form.Field
                        label="&nbsp; Send invoice by email"
                        control="input"
                        type="radio"
                        name="method"
                        value="email"
                        onChange={changeMethod}
                      />
                      {method === 'email' && (
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email"
                          defaultValue={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      )}
                      <Form.Field
                        label="&nbsp; Paid via Paypal"
                        control="input"
                        type="radio"
                        name="method"
                        value="paypal"
                        onChange={changeMethod}
                      />
                      <Form.Field
                        label="&nbsp; Paid in Xero"
                        control="input"
                        type="radio"
                        name="method"
                        value="xero"
                        onChange={changeMethod}
                      />
                      <Form.Field
                        label="&nbsp; Paid in cash"
                        control="input"
                        type="radio"
                        name="method"
                        value="cash"
                        onChange={changeMethod}
                      />
                      {showDate && <Input name="date" placeholder="Date paid (leave blank for today)" />}
                    </Form.Group>
                  </Form>
                  <Button id="doit" type="button" onClick={adminDoIt}>
                    Do it
                  </Button>
                  <Button id="cancel" type="button" onClick={adminCancel}>
                    Cancel
                  </Button>
                </Segment>
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>
        </div>
      )}
      {promo && promo.status && (
        <Header style={{ textAlign: 'center', color: 'red' }}>
          <Icon name="meh outline" color="red" />

          {promo.status}
        </Header>
      )}
    </div>
  )
}

export default Checkout
