import { Meteor } from 'meteor/meteor'
import React from 'react'
import Locations from '/imports/api/locations/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.locations', 'saving', form)
    push('/admin/locations')
  },
}

const Adder = (props) => {
  push = useHistory()?.push
  const defaultObject = config?.add?.defaultObject || {}
  return <Add {...props} item={defaultObject} methods={methods} loading={false} />
}
export default Adder
