import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import { CartContext } from './cart-data'
import Price from './price'
const mkid = name => name.toLowerCase().replace(/[\W+]/g, '_')

const PayNowButton = props => {
  const { productCode, memberId, amount } = props
  const paymentUrl = `${Meteor.settings.public.paymentSite}?amount=${amount}&description=${productCode}%2F${memberId}&amount_editable=false&success_url=https%3A%2F%2Fpa.almsford.org%2Fshop%2Fpaid`
  const options =
    'location=no,toolbar=no,footer=yes,footercolor=#cccccc,closebuttoncaption=Close,closebuttoncolor=#888888'
  const openPayment = () => {
    window.open(paymentUrl, '_system', options)
  }
  return (
    <Button floated="right" type="button" icon="credit card" color="red" onClick={openPayment}>
      Pay ${amount} now
    </Button>
  )
}

export const ProductCardOnly = props => {
  const img = props.image || '/images/gym.jpg'
  const { mode, takeAction, remove, color = 'green', name, description, price, code, prodQty } = props
  return (
    <Card sx={{ width: 260, borderTop: `4px solid ${color}` }}>
      <CardContent>
        {mode === 'remove' && (
          <Button
            size="small"
            type="button"
            onClick={remove}
            color="error"
            id={mkid(`rm ${code}`)}
            title="Remove this item"
          >
            X
          </Button>
        )}
        <CardMedia component="img" image={img} alt={name} sx={{ height: 80, width: 80, objectFit: 'cover' }} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {mode === 'next' && (
          <Box>
            {prodQty > 1 && <span>{prodQty} x </span>}
            <Price cents={price} />
          </Box>
        )}
        {mode === 'add' && (
          <Box>
            <Price cents={price} />
          </Box>
        )}
        {mode === 'remove' && (
          <Box>
            {prodQty > 1 && <span>{prodQty} x </span>}
            <Price cents={price} />
            {/* <PayNowButton productCode={code} memberId={props.memberId} amount={(qty * price) / 100} /> */}
          </Box>
        )}
        {(mode === 'next' || mode === 'add') && (
          <Button
            id={mkid(name)}
            type="button"
            onClick={takeAction}
            variant="contained"
            sx={{ backgroundColor: color }}
          >
            {mode === 'next' ? 'Next' : 'Add to cart'}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
export const ProductCard = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const add = () => {
    const product = cloneDeep(props)
    if (sessionStorage.getItem('memberId')) product.memberId = sessionStorage.getItem('memberId')
    dispatch({ type: 'add', payload: product })
  }

  const remove = () => {
    dispatch({ type: 'remove', payload: props._id })
  }

  return <ProductCardOnly {...props} takeAction={add} remove={remove} />
}

ProductCard.propTypes = {
  mode: PropTypes.string.isRequired
}

export default ProductCard
