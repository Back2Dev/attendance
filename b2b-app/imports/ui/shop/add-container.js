import React from 'react'
import { useParams } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import Products from '/imports/api/products/schema'
import Profiles from '/imports/api/profiles/schema'
import AddProduct from './add-product'

const AddProductWrapper = props => {
  const { slug, profileId } = useParams()
  const { product, member, loading } = useTracker(() => {
    const productSub = Meteor.subscribe('product.byslug', slug)
    const memberSub = Meteor.subscribe('member', profileId)
    return {
      product: Products.findOne({ slug }),
      member: Profiles.findOne(profileId),
      loading: !(productSub.ready() && memberSub.ready())
    }
  }, [slug, profileId])

  return <AddProduct product={product} member={member} loading={loading} {...props} />
}

export default AddProductWrapper
