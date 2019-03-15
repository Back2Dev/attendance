// This component will use withTracker

import { withTracker } from 'meteor/react-meteor-data'
import cloneDeep from 'lodash'
import Products from '/imports/api/products/schema'

export default withTracker(props => {
  const productsHandle = Meteor.subscribe('product.types')
  // const productsHandle = Meteor.subscribe('all.products')
  const types = Products.find({})
    .fetch()
    .reduce((item, acc) => {
      const newAcc = cloneDeep(acc)
      newAcc[item.type] = acc[item.type] ? acc[item.type] + 1 : 1
      return newAcc
    }, {})
  console.log(types)
  const products = Object.keys(types).map(type => ({ type: type, count: types[type] }))
  return {
    products,
    loading: !productsHandle.ready(),
  }
})(PurchaseOptions)
