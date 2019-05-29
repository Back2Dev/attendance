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
  const [product, setProduct] = React.useState(props.myProduct)
  const { state, dispatch } = React.useContext(CartContext)
  const add = () => {
    const prod = cloneDeep(product)
    prod.memberId = props.member._id
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
    setProduct(null)
  }
  const logoFile = props.logo || '/images/logo-tiny.jpg'
  if (props.loading) return <div>Loading...</div>
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
          <Grid.Column width={8} centered>
            <h4>Please choose a membership option </h4>
            <Card.Group centered>
              {!(product && product.name) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                  {props.products.map(p => (
                    <ProductButton key={p.name} {...p} onClick={() => selectOption(p)} />
                  ))}
                </div>
              )}
              {product && product.name && (
                <div>
                  <ProductCardOnly mode="add" {...product} add={add} remove={remove} />
                  <Button type="button" onClick={change} color="blue" inverted style={{ marginTop: '12px' }}>
                    Change
                  </Button>
                </div>
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
  myProduct: PropTypes.object
}
export default Renew
