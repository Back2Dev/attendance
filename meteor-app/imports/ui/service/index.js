import React from 'react'
import { withRouter } from 'react-router-dom'
<<<<<<< HEAD
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/assessments/serviceItems'
import Services from '/imports/api/assessments/services'
=======
import { Tab } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'

>>>>>>> a7e0104cad2d78811e3dcbd825bee5e3be59b3cf
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
        <Client />
      </Tab.Pane>
    )
  }
]

const Loading = () => <div>Loading...</div>

const Loader = props => {
  if (props.loading) {
    return <Loading />
  }
  return <Service {...props} />
}

export const serviceState = {
  data: [],
  tags: []
}

export default withTracker(props => {
  console.log('its coming here')

  const allServicesHandle = Meteor.subscribe('all.services')

  if (allServicesHandle.ready()) {
    const serviceItems = ServiceItems.find().fetch()
    serviceState.data = serviceItems

    const services = Services.find().fetch()

    const majorService = {
      name: 'Major Service',
      items: []
    }
    const minorService = {
      name: 'Minor Service',
      items: []
    }

    services.map(service => {
      service.greyed = false
      if (service.package === 'Minor') {
        const serviceCopy = { ...service }
        minorService.items.push(serviceCopy)
      }
      majorService.items.push(service)
    })

    serviceState.data = [...serviceState.data, minorService, majorService]
  }

  serviceState.loading = !allServicesHandle.ready()

  return serviceState
})(Loader)
