import React from 'react'
import PropTypes from 'prop-types'
import { ServiceContextProvider } from './service-context'
import Edit from './edit'
import Search from './search'

import Summary from './summary'
import Customer from './customer'
import { Tab } from 'semantic-ui-react'

const panes = (props) => {
  let foundationPanes = [
    {
      menuItem: 'Service',
      render: () => (
        <Tab.Pane props={props}>
          <Search />
          <Edit />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Details',
      render: () => (
        <Tab.Pane props={props}>
          <Customer />
        </Tab.Pane>
      ),
    },
  ]

  if (props.job && props.logs && props.updateStatus && props.currentJob && props.members) {
    foundationPanes.push({
      menuItem: 'Summary',
      render: () => (
        <Tab.Pane>
          <Summary
            job={props.job}
            logs={props.logs}
            updateStatus={props.updateStatus}
            key={props.currentJob._id}
            currentJob={props.currentJob}
            members={props.members}
          />
        </Tab.Pane>
      ),
    })
  }
  return foundationPanes
}

function Service(props) {
  return (
    <ServiceContextProvider {...props}>
      <Tab panes={panes(props)} />
    </ServiceContextProvider>
  )
}

Service.propTypes = {
  serviceOptions: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
}

export default Service
