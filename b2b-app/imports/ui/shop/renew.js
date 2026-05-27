import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'

import MembershipCard from '/imports/ui/member-card/member-card'
import { ProductCardOnly } from '/imports/ui/shop/product-card'
import ProductButton from '/imports/ui/shop/product-button'
import { CartContext } from './cart-data'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:renew')

const Renew = (props) => {
  const history = useHistory()
  const [product, setProduct] = React.useState(props.cart.products[0] || props.myProduct)
  const { state, dispatch } = React.useContext(CartContext)
  // With the next action, the product is in the cart already
  const next = () => {
    history.push('/shop/checkout')
  }
  // Here we have to add it into the cart
  const add = () => {
    const prod = cloneDeep(product)
    prod.profileId = props.member._id || sessionStorage.getItem('profileId')
    prod.email = props.member.email
    if (props.purchases && props.purchases.length) prod.expiry = props.purchases[0].expiry
    prod.qty = 0
    dispatch({ type: 'add', payload: prod })
    history.push('/shop/checkout')
  }

  const remove = (props) => {}
  const selectOption = (product) => {
    dispatch({ type: 'add', payload: product })
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
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        <Box
          component="img"
          src={logoFile}
          alt="Logo"
          sx={{ height: 35, mr: 1, verticalAlign: 'middle' }}
        />
        {props.org} membership renewal
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <MembershipCard member={props.member} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Please choose a membership option</Typography>
            {haveCart && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {cart.products.map((p) => (
                  <ProductCardOnly
                    mode="next"
                    takeAction={next}
                    key={p.name}
                    {...p}
                    onClick={() => selectOption(p)}
                    prodQty={cart.prodqty[p._id]}
                  />
                ))}
              </Box>
            )}
            {!(product && product.name) && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {props.products.map((p) => (
                  <ProductButton key={p.name} {...p} onClick={() => selectOption(p)} />
                ))}
              </Box>
            )}
            {!haveCart && product && product.name && (
              <Box sx={{ mt: 2 }}>
                <ProductCardOnly
                  mode="add"
                  {...product}
                  takeAction={add}
                  remove={remove}
                />
              </Box>
            )}
            {product && product.name && (
              <Button variant="outlined" onClick={change} sx={{ mt: 2 }}>
                Change
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
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
  myProduct: PropTypes.object,
}
export default Renew
