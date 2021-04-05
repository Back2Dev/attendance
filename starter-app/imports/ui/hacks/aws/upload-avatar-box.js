import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
// import Templates from '/imports/api/templates/schema'
import { file2BinString } from '/imports/ui/utils/files'
import Main from './upload-avatar'
import { meteorCall } from '/imports/ui/utils/meteor'

const debug = require('debug')('se:aws')

const save = (data) => {
  debug('data', data)
  meteorCall('upload.avatar', 'Uploading', data)
}

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <Main {...props}></Main>
}

const AvatarBox = withTracker((props) => {
  return {
    items: [],
    save,
  }
})(Loading)

export default AvatarBox
