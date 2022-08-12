import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Schemas from '/imports/api/schemas/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import Add from './add'
import config from './config'

const debug = require('debug')('app:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.schemas', 'saving', form)
    push('/admin/schemas')
  },
}

const Loading = (props) => {
  push = useHistory()?.push
  if (props.loading) return <Loader loading />
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
