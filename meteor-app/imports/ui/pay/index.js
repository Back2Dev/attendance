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
  debug(`jobNo ${jobNo}`)

  const subsHandle = Meteor.subscribe('assessments.jobNo', jobNo)
  const job = Assessments.findOne({ jobNo })
  return {
    job,
    loading: !subsHandle.ready()
  }
})(Loading)
