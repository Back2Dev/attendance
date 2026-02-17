import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { ProductTypes } from '/imports/api/products/schema'
import ShopWindow from './window'

const BuildingWrapper = (props) => {
  const { productTypes, loading, settings } = useTracker(() => {
    const prodTypesHandle = Meteor.subscribe('product.types')
    return {
      productTypes: ProductTypes.find({}).fetch(),
      loading: !prodTypesHandle.ready(),
      settings: Meteor.settings.public,
    }
  }, [])

  return (
    <ShopWindow
      productTypes={productTypes}
      loading={loading}
      settings={settings}
      {...props}
    />
  )
}

export default BuildingWrapper
