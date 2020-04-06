import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Loader } from 'semantic-ui-react'
import Jobs from '/imports/api/jobs/schema'
import ServiceItems from '/imports/api/service-items/schema'
import Services from '/imports/api/assessments/services'
import Service from './service'

// This is a container component.
// It is allowed to access things like
// Meteor methods
// API Calls to remote systems
// Meteor.settings (deprecated)

const ServiceIndex = (props) => {
  if (props.loading) {
    return <Loader />
  }
  return <Service {...props} />
}

export default withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.services')
  const serviceItems = ServiceItems.find().fetch()
  const services = Services.find().fetch()

  Meteor.subscribe('jobs.all')

  const updateJob = async (state) => {
    // // Adding an job
    // try {
    //   debug('adding job', state)
    //   const res = await Meteor.callAsync('job.save', state)
    //   return res
    // } catch (e) {
    //   console.log('error')
    // }
  }

  const majorService = {
    name: 'Major Service',
    title: 'Major Service',
    items: [],
    expanded: false,
    price: 120,
    cents: 12000,
  }
  const minorService = {
    name: 'Minor Service',
    title: 'Minor Service',
    items: [],
    expanded: false,
    price: 60,
    cents: 6000,
  }

  serviceItems.forEach((item) => {
    item.title = item.name
    item.cents = item.price
    item.price = item.cents / 100
  })

  services.map((item) => {
    item.greyed = false
    item.cents = item.price
    item.price = item.cents / 100
    if (item.package === 'Minor') {
      const itemCopy = { ...item }
      minorService.items.push(itemCopy)
    }
    majorService.items.push(item)
  })

  serviceItems.push(minorService)
  serviceItems.push(majorService)

  const loading = !subsHandle.ready()
  const tags = []
  let totalPrice = 0
  let name = ''
  let email = ''
  let phone = ''
  let make = ''
  let model = ''
  let color = ''
  let replacement = false
  let urgent = false
  let sentimental = false

  return {
    serviceItems,
    tags,
    totalPrice,
    name,
    email,
    phone,
    make,
    model,
    color,
    replacement,
    urgent,
    sentimental,
    updateJob,
    loading,
  }
})(ServiceIndex)
