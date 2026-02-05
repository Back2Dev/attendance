import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import ServiceItems from '/imports/api/service-items/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('target:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.serviceItems', 'saving', form)
    push('/admin/service-items')
  },
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <div>Loading...</div>
  return <Add {...props}></Add>
}
const Adder = withTracker((props) => {
  const defaultObject = config?.add?.defaultObject || {}
  return {
    item: defaultObject,
    methods,
    loading: false,
  }
})(Loading)
export default Adder
