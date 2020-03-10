import React from 'react'
import SearchBar from './service-item-search'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContextProvider } from './service-context'
import ServiceItemTagContainer from './serviceItem-tag-container'
import ServiceItemSearchContainer from './service-item-search-container'

function Service() {
  return (
    <ServiceContextProvider>
      <ServiceItemSearchContainer />
      <ServiceItemTagContainer />
    </ServiceContextProvider>
  )
}

export default Service
