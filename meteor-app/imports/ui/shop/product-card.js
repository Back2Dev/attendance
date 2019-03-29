import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Image, Icon } from 'semantic-ui-react'
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
  const { mode } = props
  return (
    <Card color={props.color}>
      <Card.Content>
        <Image floated="right" size="mini" src={img} />
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {mode === 'add' && (
          <div>
            <Price cents={props.price} />
            &nbsp;
            <Button type="button" onClick={add} color={props.color}>
              Add to cart
            </Button>
            {state.prodqty && state.prodqty[props._id] && (
              <span style={{ float: 'right' }}>
                {state.prodqty[props._id]}&nbsp;
                <Button size="mini" compact color="red" type="button" onClick={remove} title="Remove this item">
                  x
                </Button>
              </span>
            )}
          </div>
        )}
        {mode === 'remove' && (
          <div>
            {props.qty > 1 && <span>{props.qty} x </span>}
            <Price cents={props.price} />
            <Button floated="right" color="red" type="button" onClick={remove} title="Remove this item">
              X
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default ProductCard
