import React from 'react'
import PropTypes from 'prop-types'
import SearchBar from './service-item-search'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContextProvider } from './service-context'
import ServiceItemTagContainer from './serviceItem-tag-container'
import ServiceItemSearchContainer from './service-item-search-container'

function Service(props) {
  return (
    <ServiceContextProvider {...props}>
      <ServiceItemSearchContainer />
      <ServiceItemTagContainer />
    </ServiceContextProvider>
  )
}

Service.propTypes = {
  data: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
}

export default Service
