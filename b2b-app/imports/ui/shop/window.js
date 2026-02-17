import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import CartSummary from './cart-summary'
import useHistory from '/imports/ui/utils/history'

const mkid = name => name.toLowerCase().replace(/[\W+]/g, '_')

const ProdTypeCard = props => {
  const history = useHistory()
  const go = () => {
    history.push(`/shop/type/${props.type}`)
  }
  return (
    <Box key={props.type}>
      <Button
        id={mkid(props.name)}
        type="button"
        onClick={go}
        variant="contained"
        startIcon={<CircleIcon sx={{ color: props.color }} />}
      >
        {props.name}
      </Button>
    </Box>
  )
}

const ShopWindow = props => {
  const history = useHistory()
  const { productTypes, settings } = props
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{settings.org} Shop</Typography>
      <CartSummary />
      <Typography variant="body1">{settings.tagline}</Typography>
      {props.loading && <Typography variant="body2">Loading...</Typography>}
      {!props.loading &&
        productTypes &&
        productTypes.length &&
        productTypes.map((prodType) => (
          <ProdTypeCard key={prodType.type} {...prodType} />
        ))}
      {/* <GoHome history={props.history} /> */}
    </Stack>
  )
}

ShopWindow.propTypes = {
  loading: PropTypes.bool.isRequired,
  productTypes: PropTypes.array,
  settings: PropTypes.object.isRequired,
}
export default ShopWindow
