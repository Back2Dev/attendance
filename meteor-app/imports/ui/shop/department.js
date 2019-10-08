import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Products, { ProductTypes, Carts } from '/imports/api/products/schema'
import Counter from './counter'

export default withTracker(props => {
  const cartId = sessionStorage.getItem('mycart')
  const productsSub = Meteor.subscribe('products.bytype', props.match.params.type, cartId)
  const type = props.match.params.type
  return {
    products: Products.find({ type }).fetch(),
    prodType: ProductTypes.find({ type }).fetch()[0],
    productTypes: ProductTypes.find({ type: { $ne: type } }).fetch(),
    cart: Carts.findOne(cartId),
    loading: !productsSub.ready()
  }
})(Counter)
