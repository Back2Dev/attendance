import React from 'react'
import { useParams } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import Products from '/imports/api/products/schema'
import Members from '/imports/api/members/schema'
import AddProduct from './add-product'

const AddProductWrapper = props => {
  const { code, memberId } = useParams()
  const { product, member, loading } = useTracker(() => {
    const productSub = Meteor.subscribe('product.bycode', code)
    const memberSub = Meteor.subscribe('member', memberId)
    return {
      product: Products.findOne({ code }),
      member: Members.findOne(memberId),
      loading: !(productSub.ready() && memberSub.ready())
    }
  }, [code, memberId])

  return <AddProduct product={product} member={member} loading={loading} {...props} />
}

export default AddProductWrapper
