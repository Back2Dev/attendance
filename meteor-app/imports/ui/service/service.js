import React from 'react'
import PropTypes from 'prop-types'
import SearchBar from './service-item-search'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContextProvider } from './service-context'
import ServiceItemTagContainer from './serviceItem-tag-container'
import ServiceItemSearchContainer from './service-item-search-container'

import Summary from './summary-tab'
import FromTrail from './client'
import Client from './client'
import { Tab } from 'semantic-ui-react'

const panes = props => {
  return [
    {
      menuItem: 'Service',
      render: () => (
        <Tab.Pane>
          <ServiceContextProvider {...props}>
            <ServiceItemSearchContainer />
            <ServiceItemTagContainer />
          </ServiceContextProvider>
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Details',
      render: () => (
        <Tab.Pane>
          <Client />
        </Tab.Pane>
      )
    }
  ]
}

function Service(props) {
  console.log('props from Service comp = ', props)

  return <Tab panes={panes(props)} />
}

Service.propTypes = {
  data: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
}

export default Service
