import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Image } from 'semantic-ui-react'
import { cloneDeep } from 'lodash'
import { CartContext } from './cart-data'
import Price from './price'
const mkid = name => name.toLowerCase().replace(/[\W+]/, '_')

const PayNowButton = props => {
  const { productCode, memberId, amount } = props
  const paymentUrl = `${
    Meteor.settings.public.paymentSite
  }?amount=${amount}&description=${productCode}%2F${memberId}&amount_editable=false&success_url=https%3A%2F%2Fpa.almsford.org%2Fshop%2Fpaid`
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
  const { mode, takeAction, remove, color = 'green', name, description, price, code, qty } = props
  return (
    <Card color={color}>
      <Card.Content>
        {mode === 'remove' && (
          <Button size="mini" floated="right" type="button" onClick={remove} color="red" title="Remove this item">
            X
          </Button>
        )}
        <Image floated="left" size="mini" src={img} />
        <Card.Header>{name}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {mode === 'next' && (
          <div>
            <Price cents={price} />
            &nbsp;
            <Button type="button" onClick={takeAction} color={color}>
              Next
            </Button>
          </div>
        )}
        {mode === 'add' && (
          <div>
            <Price cents={price} />
            &nbsp;
            <Button id={mkid(name)} type="button" onClick={takeAction} color={color}>
              Add to cart
            </Button>
          </div>
        )}
        {mode === 'remove' && (
          <div>
            {qty > 1 && <span>{qty} x </span>}
            <Price cents={price} />
            {/* <PayNowButton productCode={code} memberId={props.memberId} amount={(qty * price) / 100} /> */}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
export const ProductCard = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const add = () => {
    const product = cloneDeep(props)
    product.qty = 0
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
