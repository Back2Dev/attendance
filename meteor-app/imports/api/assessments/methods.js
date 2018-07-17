import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './assessment'
import Parts from './parts'
import Services from './services'
import Logger from './logger'

Meteor.methods({
  'assessments.insert'(form) {
    check(form, Object)
    
    // Check to ensure that total cost from each service item is equal totalServiceCost
    // Check to ensure that total cost from each parts item is equal totalPartsCost
    const calcServiceCost = form.services.serviceItem.reduce((a, b) => {
      return (a + b['price'])
    }, 0)
    const calcPartsCost = form.parts.partsItem.reduce((a, b) => {
      return (a + b['price'])
    }, 0)
    const checkServiceCost = calcServiceCost === form.services.totalServiceCost
    const checkPartsCost = calcPartsCost === form.parts.totalPartsCost

    if (!checkServiceCost || !checkPartsCost) {
      throw new Meteor.Error('Totol service cost or total parts cost not equal the sum of its parts')
    }

    // Check to ensure that total cost of repair is the sum of totalServiceCost, totalPartsCost and additionalFees
    const checkTotalCost = (form.services.totalServiceCost + form.parts.totalPartsCost + form.additionalFees) === form.totalCost
    if (!checkTotalCost) {
      throw new Meteor.Error('Total cost does not equal sum of all cost!')
    }

    Assessment.insert(form)
  },
  'assessments.updateJobDetail'(jobId, updatedJob) {
    check(jobId, String)
    check(updatedJob, Object)

    Assessment.update(jobId, { $set: { updatedJob } });
  },
  'logger.insert'(log) {
    check(log, Object)

    Logger.insert(log)
  },
})
