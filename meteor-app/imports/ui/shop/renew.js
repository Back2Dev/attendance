import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'
import { Button, Image, Card, Segment, Grid, Header } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card-small'
import MembershipCard from '/imports/ui/member-card/member-card'
import { ProductCardOnly } from '/imports/ui/shop/product-card'
import ProductButton from '/imports/ui/shop/product-button'
import { CartContext } from './cart-data'

const Renew = props => {
  const [product, setProduct] = React.useState(props.cart.products[0] || props.myProduct)
  const { state, dispatch } = React.useContext(CartContext)
  // With the next action, the product is in the cart already
  const next = () => {
    props.history.push('/shop/checkout')
  }
  // Here we have to add it into the cart
  const add = () => {
    const prod = cloneDeep(product)
    prod.memberId = props.member._id || sessionStorage.getItem('memberId')
    prod.email = props.member.email
    if (props.purchases && props.purchases.length) prod.expiry = props.purchases[0].expiry
    prod.qty = 0
    dispatch({ type: 'add', payload: prod })
    props.history.push('/shop/checkout')
  }

  const remove = props => {}
  const selectOption = product => {
    setProduct(product)
  }
  const change = () => {
    dispatch({ type: 'clear' })
    setProduct(null)
  }

  const logoFile = props.logo || '/images/logo-tiny.jpg'
  if (props.loading) return <div>Loading...</div>
  let { cart } = props
  const haveCart = cart && cart.products && cart.products.length > 0
  return (
    <div>
      <Header as="h1">
        <Image src={logoFile} height="35px" /> {props.org} membership renewal
      </Header>
      <Segment>
        <Grid style={{ height: '100%' }} verticalAlign="middle" centered>
          <Grid.Column width={8}>
            <Card.Group centered>
              <MembershipCard member={props.member} />
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <h4>Please choose a membership option </h4>
            <Card.Group centered>
              {haveCart && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                  {cart.products.map(p => (
                    <ProductCardOnly
                      mode="next"
                      takeAction={next}
                      key={p.name}
                      {...p}
                      onClick={() => selectOption(p)}
                    />
                  ))}
                </div>
              )}
              {!(product && product.name) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                  {props.products.map(p => (
                    <ProductButton key={p.name} {...p} onClick={() => selectOption(p)} />
                  ))}
                </div>
              )}
              {!haveCart && product && product.name && (
                <ProductCardOnly mode="add" {...product} takeAction={add} remove={remove} />
              )}
              {product && product.name && (
                <Button type="button" onClick={change} color="blue" inverted style={{ marginTop: '12px' }}>
                  Change
                </Button>
              )}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}

Renew.propTypes = {
  member: PropTypes.object.isRequired,
  org: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  purchases: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
  myProduct: PropTypes.object
}
export default Renew
