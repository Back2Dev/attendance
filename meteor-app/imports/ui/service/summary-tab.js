import React, { useContext } from 'react'
import { ServiceContext } from './service-context'
import Summary from './summary'

import {
  LOG_EVENT_READABLE,
  STATUS_UPDATE,
  MECHANIC_UPDATE,
  NEW_JOB,
  PHONE_CALL,
  SEND_SMS,
  JOB_STATUS,
  JOB_STATUS_READABLE,
  JOB_STATUS_BUTTON,
  JOB_STATUS_STYLES,
  LOG_EVENT_TYPES
} from '/imports/api/constants'

export default function SummaryTabContainer() {
  const [state, setState] = useContext(ServiceContext)

  const servicePackage = services.baseService
  const pickupDisplay = moment(pickupDate).format('D/M/YYYY')
  const statusText = status <= JOB_STATUS.PICKED_UP ? JOB_STATUS_BUTTON[status] : 'Cancelled'
  const cancelText = status <= JOB_STATUS.READY_FOR_PICK_UP ? 'Cancel Job' : 'Re-open Job'

  const updateButton = () => {
    const jobId = props.job._id
    const statusValue = props.job.status
    const statusList = Object.keys(JOB_STATUS)
    const status = statusList.find(key => JOB_STATUS[key] === statusValue) // Find key/name of current status
    const statusIndex = statusList.findIndex(element => element === status)
    const updatedStatusKey = statusList[statusIndex + 1] // Find key/name of next status
    const updatedStatus = JOB_STATUS[updatedStatusKey] // Update to the next status

    try {
      if (statusValue >= JOB_STATUS.PICKED_UP) return
      props.updateStatus(jobId, updatedStatus)
      Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[updatedStatus]}`)
    } catch (error) {
      Alert.error(error.message)
    }
  }

  const cancelButton = () => {
    const jobId = props.job._id
    const status = props.job.status
    const cancelStatus = JOB_STATUS.CANCELLED
    const completeStatus = JOB_STATUS.PICKED_UP
    const reopenStatus = JOB_STATUS.NEW
    const bikePickedUpStatus = JOB_STATUS.PICKED_UP
    try {
      if (status < bikePickedUpStatus) {
        props.updateStatus(jobId, cancelStatus)
        Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[cancelStatus]}`)
      } else if (status === cancelStatus || status === completeStatus) {
        props.updateStatus(jobId, reopenStatus)
        Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[reopenStatus]}`)
      }
      return
    } catch (error) {
      Alert.error(error.message)
    }
  }

  const renderLogs = logs => {
    if (!logs.length) {
      return <Loader active inline size="mini" />
    }
    return logs.map((log, ix) => {
      const date = moment(log.createdAt).format('ddd Do MMM, h:mm a')
      const message = status => {
        switch (status) {
          case LOG_EVENT_TYPES[STATUS_UPDATE]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[STATUS_UPDATE]]}: ${JOB_STATUS_READABLE[log.status]}`
          case LOG_EVENT_TYPES[MECHANIC_UPDATE]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[MECHANIC_UPDATE]]}: ${log.data}`
          case LOG_EVENT_TYPES[NEW_JOB]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[NEW_JOB]]} ${log.user}`
          case LOG_EVENT_TYPES[PHONE_CALL]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[PHONE_CALL]]}: ${log.data}`
          case LOG_EVENT_TYPES[SEND_SMS]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[SEND_SMS]]}: ${log.data}`
          default:
            return JOB_STATUS_READABLE[log.status]
        }
      }
      return <li key={ix}>{`${date} - ${message(log.eventType)}`}</li>
    })
  }

  return <Summary renderLogs={renderLogs} updateButton={updateButton} cancelButton={cancelButton} />
}
