import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'

import Service from './service'
import Summary from './summary-tab'
import FromTrail from './clientOP2'
import Client from './client'

const panes = [
  {
    menuItem: 'Service',
    render: () => (
      <Tab.Pane>
        <Service />
      </Tab.Pane>
    )
  },
  {
    menuItem: 'Details',
    render: () => (
      <Tab.Pane>
        <FromTrail />
      </Tab.Pane>
    )
  }
]

const ServiceAdd = props => {
  return <Tab panes={panes} />
}

ServiceAdd.propTypes = {
  setAssessment: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default withRouter(ServiceAdd)
