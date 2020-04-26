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
  const jobSub = Meteor.subscribe('jobs.all')
  const jobId = localStorage.getItem('job-form')
  const serviceItems = ServiceItems.find().fetch()
  const services = Services.find().fetch()

  let tags = []
  let totalCost = 0
  let name = ''
  let email = ''
  let phone = ''
  let make = ''
  let model = ''
  let color = ''
  let assessor = ''
  let bikeValue = ''
  let pickupDate = new Date()
  let temporaryBike = false
  let urgent = false
  let sentimental = false
  let isRefurbish = false
  let paid = false

  const updateJob = async (data) => {
    // Adding a job
    const tags = data.tags.map((tag) => {
      return {
        _id: tag._id,
        name: tag.name,
        price: tag.cents,
        code: tag.code,
        category: tag.category,
        used: tag.used,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }
    })
    delete data.calculateTotal
    delete data.updateJob
    delete data.tags
    job = data
    job.serviceItems = tags
    job.totalCost = data.totalCost * 100
    job.status = 1
    job.dropoffDate = new Date()
    if (jobId) {
      job._id = jobId
    }
    try {
      debug('adding job', job)
      const res = await Meteor.callAsync('job.save', job)
      sessionStorage.setItem('myjob', res)
      return res
    } catch (e) {
      debug(e.message)
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

  const loading = !subsHandle.ready() && !jobSub.ready()

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
    assessor,
    bikeValue,
    pickupDate,
    temporaryBike,
    urgent,
    sentimental,
    isRefurbish,
    paid,
    updateJob,
    calculateTotal,
    loading,
  }
})(ServiceIndex)
