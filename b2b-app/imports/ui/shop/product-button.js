import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const ProductButton = props => {
  const img = props.image || '/images/gym.jpg'
  const { add, color, name } = props
  return (
    <Button type="button" onClick={props.onClick} variant="contained" sx={{ m: 0.5, bgcolor: color }}>
      {name}
    </Button>
  )
}

export default ProductButton
