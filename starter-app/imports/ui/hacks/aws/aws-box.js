import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
// import Templates from '/imports/api/templates/schema'
import Main from './aws'
import { meteorCall } from '/imports/ui/utils/meteor'

const debug = require('debug')('se:aws')

const save = (data) => {
  meteorCall('upload.avatar', 'Uploading', data)
}

const handleMethod = () => {
  debug('Uploaded to s3')
}

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <Main {...props}></Main>
}

const AWSBox = withTracker((props) => {
  return {
    save,
    handleMethod,
    items: [],
    loading: false,
  }
})(Loading)

export default AWSBox
