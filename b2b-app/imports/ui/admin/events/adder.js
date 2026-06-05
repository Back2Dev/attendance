import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import Events from '/imports/api/events/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.events', 'saving', { form })
    push('/admin/events')
  },
}

const Adder = (props) => {
  push = useHistory()?.push
  const defaultObject = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(9, 0, 0, 0)
    return { ...(config?.add?.defaultObject || {}), when: d }
  }, [])
  return <Add {...props} item={defaultObject} methods={methods} loading={false} />
}
export default Adder
