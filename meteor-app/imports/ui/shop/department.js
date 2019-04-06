import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Products, { ProductTypes } from '/imports/api/products/schema'
import Counter from './counter'

export default withTracker(props => {
  const productsSub = Meteor.subscribe('products.bytype', props.match.params.type)
  const type = props.match.params.type
  return {
    products: Products.find({ type }).fetch(),
    productTypes: ProductTypes.find({ type }).fetch(),
    loading: !productsSub.ready()
  }
})(Counter)
