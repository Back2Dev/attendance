import React from 'react'
import { useParams } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import Products, { ProductTypes, Carts } from '/imports/api/products/schema'
import Counter from './counter'
const debug = require('debug')('app:shop:dept')

const DepartmentWrapper = (props) => {
  const params = useParams()
  debug({ props, params })
  const type = params.type || 'unknown'
  const cartId = sessionStorage.getItem('mycart')

  const { products, prodType, productTypes, cart, loading } = useTracker(() => {
    const productsSub = Meteor.subscribe('products.bytype', type, cartId)
    return {
      products: Products.find({ type }).fetch(),
      prodType: ProductTypes.find({ slug: type }).fetch()[0],
      productTypes: ProductTypes.find({ slug: { $ne: type } }).fetch(),
      cart: Carts.findOne(cartId),
      loading: !productsSub.ready(),
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
