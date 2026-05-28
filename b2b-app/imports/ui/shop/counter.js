import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import CartButton, { CartMenuItem } from './cart-summary'
import CustomerMenuItem from './customer'
import ProductCard from './product-card'
import { CartContext } from './cart-data'
import useHistory from '/imports/ui/utils/history'

const Counter = props => {
  const history = useHistory()
  const { products, loading, prodType, productTypes } = props
  const { state, dispatch } = React.useContext(CartContext)

  const select = code => {
    history.push(`/shop/type/${code}`)
  }

  if (loading) return <div>Loading...</div>
  if (!prodType) return <div>Product type not found</div>
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" sx={{ color: prodType.color }}>
            <CircleIcon sx={{ fontSize: 12, mr: 1, color: prodType.color }} />
            {prodType.name} ({products.length})
          </Typography>
          {productTypes.map((ptype) => (
            <Button
              key={ptype.slug}
              type="button"
              onClick={() => select(ptype.slug)}
              startIcon={<CircleIcon sx={{ fontSize: 10, color: ptype.color }} />}
            >
              {ptype.name}
            </Button>
          ))}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <CustomerMenuItem />
            <CartMenuItem />
          </Box>
        </Stack>
      </Paper>

      <Typography variant="body1">{prodType.description}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {products.map((item) => (
          <ProductCard
            {...item}
            key={item._id}
            mode="add"
            color={prodType.color}
            prodQty={state.prodqty[item._id]}
          />
        ))}
      </Box>
      {state.totalqty > 0 && (
        <Box>
          <CartButton />
        </Box>
      )}
    </Stack>
  )
}

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array,
  productTypes: PropTypes.array
}
export default Counter
