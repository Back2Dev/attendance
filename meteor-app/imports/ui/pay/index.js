import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Assessments from '/imports/api/assessments/schema'
import Pay from './pay'

const debug = require('debug')('b2b:pay')

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
  return <Pay {...props}></Pay>
}

export default withTracker(props => {
  const jobNo = props.match.params.jobNo

  const subsHandle = Meteor.subscribe('assessments.jobNo', jobNo)
  const job = Assessments.findOne({ jobNo })
  let ccUrl = `${Meteor.settings.public.paymentSite}?`
  const org = Meteor.settings.public.org
  const logo = Meteor.settings.public.logo
  if (job) {
    const params = {
      amount: job.totalCost / 100,
      description: `Bike service ${job.jobNo}`,
      editable: 'false',
      success_url: Meteor.absoluteUrl(`/paid/${job.jobNo}`)
    }
    ccUrl += Object.keys(params)
      .map(param => `${param}=${params[param]}`)
      .join('&')
  }
  return {
    job,
    ccUrl,
    logo,
    org,
    loading: !subsHandle.ready()
  }
})(Loading)
