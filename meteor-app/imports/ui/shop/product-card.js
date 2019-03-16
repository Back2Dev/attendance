import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Image } from 'semantic-ui-react'
import { cloneDeep } from 'lodash'
import { CartContext } from './cart-data'
import Price from './price'

const ProductCard = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const add = () => {
    const product = cloneDeep(props)
    product.qty = 0
    dispatch({ type: 'add', payload: product })
  }

  const remove = () => {
    dispatch({ type: 'remove', payload: props._id })
  }

  const img = props.image || '/images/gym.jpg'
  return (
    <Card color={props.color}>
      <Card.Content>
        <Image floated="right" size="mini" src={img} />
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Price cents={props.price} />{' '}
        {props.mode === 'add' && (
          <Button type="button" onClick={add} color={props.color}>
            Add to cart
          </Button>
        )}
        {props.mode === 'remove' && (
          <Button color="red" type="button" onClick={remove} title="Remove this item">
            X
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}

export default ProductCard
