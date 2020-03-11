import ServiceItems from '/imports/api/assessments/serviceItems'
import Services from '/imports/api/assessments/services'

const data = []

export const serviceState = {
  data: data,
  tags: []
}

Tracker.autorun(() => {
  let serviceItemsHandle = Meteor.subscribe('all.serviceItems')
  let servicesHandle = Meteor.subscribe('services.all')

  if (serviceItemsHandle.ready()) {
    let serviceItems = ServiceItems.find().fetch()
    serviceState.data = serviceItems
  }

  if (servicesHandle.ready()) {
    let services = Services.find().fetch()

    let majorService = {
      name: 'Major Service',
      items: []
    }
    let minorService = {
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
})
