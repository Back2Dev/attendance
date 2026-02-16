import { Meteor } from 'meteor/meteor'
import React from 'react'
// import Templates from '/imports/api/templates/schema'
import Main from './aws'
import { meteorCall } from '/imports/ui/utils/meteor'

const debug = require('debug')('app:aws')

const save = (data) => {
  meteorCall('upload.avatar', 'Uploading', data)
}

const handleMethod = () => {
  debug('Uploaded to s3')
}

const AWSBox = (props) => {
  return <Main {...props} items={[]} save={save} handleMethod={handleMethod} loading={false} />
}

export default AWSBox
