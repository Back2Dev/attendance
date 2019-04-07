import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Products from '/imports/api/products/schema'
import Members from '/imports/api/members/schema'
import AddProduct from './add-product'

export default withTracker(props => {
  const { code, memberId } = props.match.params
  const productSub = Meteor.subscribe('product.bycode', code)
  const memberSub = Meteor.subscribe('member', memberId)
  return {
    product: Products.findOne({ code }),
    member: Members.findOne(memberId),
    loading: !(productSub.ready() && memberSub.ready())
  }
})(AddProduct)
