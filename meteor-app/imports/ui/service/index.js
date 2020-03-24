import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'
import Services from '/imports/api/assessments/services'
import Service from './service'

const Loading = () => <div>Loading...</div>

const Loader = props => {
  if (props.loading) {
    return <Loading />
  }
  return <Service {...props} />
}

export const serviceState = {
  data: [],
  tags: [],
  totalServicePrice: 0,
  formData: {}
}

export default withTracker(props => {
  const allServicesHandle = Meteor.subscribe('all.services')

  if (allServicesHandle.ready()) {
    const serviceItems = ServiceItems.find().fetch()
    serviceState.data = serviceItems

    const services = Services.find().fetch()

    const majorService = {
      name: 'Major Service',
      items: [],
      expanded: false
    }
    const minorService = {
      name: 'Minor Service',
      items: [],
      expanded: false
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
