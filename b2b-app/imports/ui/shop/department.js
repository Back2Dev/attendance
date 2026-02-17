import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import Products, { ProductTypes, Carts } from '/imports/api/products/schema'
import Counter from './counter'

const DepartmentWrapper = props => {
  const { type } = props.match.params
  const cartId = sessionStorage.getItem('mycart')

  const { products, prodType, productTypes, cart, loading } = useTracker(() => {
    const productsSub = Meteor.subscribe('products.bytype', type, cartId)
    return {
      products: Products.find({ type }).fetch(),
      prodType: ProductTypes.find({ type }).fetch()[0],
      productTypes: ProductTypes.find({ type: { $ne: type } }).fetch(),
      cart: Carts.findOne(cartId),
      loading: !productsSub.ready()
    }
  }, [type, cartId])

  return (
    <Counter
      products={products}
      prodType={prodType}
      productTypes={productTypes}
      cart={cart}
      loading={loading}
      {...props}
    />
  )
}

export default DepartmentWrapper
