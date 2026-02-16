import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import React from 'react'
// import Templates from '/imports/api/templates/schema'
import { file2BinString } from '/imports/ui/utils/files'
import Main from './upload-avatar'
import { meteorCall } from '/imports/ui/utils/meteor'

const debug = require('debug')('app:aws')

const save = (data) => {
  debug('data', data)
  meteorCall('upload.avatar', 'Uploading', data)
}

const AvatarBox = (props) => {
  return <Main {...props} items={[]} save={save} />
}

export default AvatarBox
