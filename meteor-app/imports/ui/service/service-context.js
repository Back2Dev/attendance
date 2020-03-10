import React, { useState, createContext } from 'react'
import ServiceItems from '/imports/api/assessments/serviceItems'
import Services from '/imports/api/assessments/services'
// import service from './index'

console.log(ServiceItems)

// import {createContainer} from "meteor/react-meteor-data"

export const ServiceContext = createContext()

const data = [
  { title: 'item1', isMajMin: false },
  { title: 'item2', isMajMin: false },
  { title: 'item3', isMajMin: false },
  { title: 'item4', isMajMin: false },
  { title: 'item5', isMajMin: false },
  { title: 'item6', isMajMin: false },
  { title: 'item6', isMajMin: false },

  { title: 'item17', isMajMin: false },
  {
    title: 'Major Service',
    isMajMin: true,
    items: [
      { title: 'mj1', greyed: false },
      { title: 'mj2', greyed: false },
      { title: 'mj3', greyed: false },
      { title: 'mj4', greyed: false },
      { title: 'mj5', greyed: false },
      { title: 'mj16', greyed: false },
      { title: 'mj17', greyed: false },
      { title: 'mj18', greyed: false }
    ]
  },
  {
    title: 'Minor Service',
    isMajMin: true,
    items: [
      { title: 'mn1', greyed: false },
      { title: 'mn2', greyed: false },
      { title: 'mn3', greyed: false },
      { title: 'mn4', greyed: false },
      { title: 'mn5', greyed: false },
      { title: 'mn6', greyed: false },
      { title: 'mn18', greyed: false },
      { title: 'mn19', greyed: false },
      { title: 'mn20', greyed: false }
    ]
  }
]

const serviceState = {
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

export const ServiceContextProvider = props => {
  const [state, setState] = useState(serviceState)

  console.log('state =', state)

  return <ServiceContext.Provider value={[state, setState]}>{props.children}</ServiceContext.Provider>
}
