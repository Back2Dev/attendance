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

const debug = require('debug')('b2b:service')

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

  const updateJob = async (data) => {
    // Adding a job
    const job = {}
    const tags = data.tags
      // .filter((key) => {
      //   if (!data) {
      //     return 0
      //   }
      //   const formattedParts = data.tags.map((item) => item.replace(/ \(\$\w+\)/, '').trim())
      //   return formattedParts.includes(key.name) ? key.price : 0
      // })
      .map((tag) => {
        return {
          name: tag.name,
          price: tag.price,
          code: tag.code,
          category: tag.category,
          used: tag.used,
        }
      })
    job.serviceItems = tags
    job.bikeValue = 23
    job.totalCost = data.totalCost * 100
    console.log(tags)
    console.log(job.totalCost)
    try {
      debug('adding job', job)
      const res = await Meteor.callAsync('job.save', job)
      return res
    } catch (e) {
      console.log(e.message)
    }
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

  const calculateTotal = (tags) => {
    return tags.reduce((total, tag) => {
      return total + tag.price
    }, 0)
  }

  serviceItems.push(minorService)
  serviceItems.push(majorService)

  const loading = !subsHandle.ready()
  const tags = []
  let totalCost = 0
  let name = ''
  let email = ''
  let phone = ''
  let make = ''
  let model = ''
  let color = ''
  let replacement = false
  let urgent = false
  let sentimental = false
  let isRefurbish = false

  return {
    serviceItems,
    tags,
    totalCost,
    name,
    email,
    phone,
    make,
    model,
    color,
    replacement,
    urgent,
    sentimental,
    isRefurbish,
    updateJob,
    calculateTotal,
    loading,
  }
})(ServiceIndex)
