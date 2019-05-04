import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { ProductTypes } from '/imports/api/products/schema'
import ShopWindow from './window'

export default withTracker(props => {
  const prodTypesHandle = Meteor.subscribe('product.types')
  return {
    productTypes: ProductTypes.find({}).fetch(),
    loading: !prodTypesHandle.ready(),
    org: Meteor.settings.public.org || 'Widget',
    tagline: Meteor.settings.public.tagline || "We'd love to help you learn how to fix your bike. Here's what we offer"
  }
})(ShopWindow)
