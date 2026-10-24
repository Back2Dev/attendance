import React, { useMemo } from 'react'
import { meteorCall } from '/imports/ui/utils/meteor'
import Add from './add'
import config from './config'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:setup:adder')
let push

const methods = {
  save: (form) => {
    meteorCall('insert.events', 'saving', { form })
    push('/setup/events')
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
