import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Forms from '/imports/api/forms/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './framework/framework'
import { RecoilRoot } from 'recoil'

const debug = require('debug')('app:editor')
let history

const remove = (id) => meteorCall('rm.forms', 'Deleting', id)
const update = (id, form, quit) => {
  meteorCall('update.forms', 'updating', form)
  if (quit) history.push('/admin/forms')
}
const methods = { remove, update }

const Loading = (props) => {
  if (props.loading) return <div>Loading...</div>
  return (
    <RecoilRoot>
      <Edit {...props}></Edit>
    </RecoilRoot>
  )
}

const Editor = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.forms', id)
  const item = Forms.findOne(id) || {}
  return {
    id,
    item,
    methods,
    loading: !subsHandle.ready(),
  }
})(Loading)
export default Editor
