import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, List, Accordion, Icon, Grid, Loader } from 'semantic-ui-react'
import Alert from '/imports/ui/utils/alert'

import '/imports/ui/layouts/assessment.css'
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
import printJobCard from '/imports/ui/assessment/assessment-print-job'
import MechanicModal from '../assessment/mechanic-modal'
import SmsModal from '../assessment/sms-modal'
import PhoneModal from '../assessment/phone-modal'

const Summary = props => {
  const { status, jobNo, bikeDetails, services, mechanic, pickupDate, totalCost, customerDetails } = props.job

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

  return (
    <div>
      <Grid stackable>
        <Grid.Row columns={2} style={{ marginTop: '20px' }}>
          <Grid.Column style={{ fontSize: '1.2em' }}>
            <List.Item>
              <strong>{servicePackage} </strong> Due: {pickupDisplay} <strong>Mechanic: </strong>
              {mechanic}
            </List.Item>
            <ul>
              <strong>Activity: </strong>
              {renderLogs(props.logs)}
            </ul>
            <br />
            <Button.Group>
              <Button
                className="ui button"
                color="green"
                style={{ textAlign: 'center', borderRadius: '5px', width: '200px' }}
                onClick={updateButton}
              >
                <h2>{statusText}</h2>
              </Button>
              <Button
                className="ui button"
                color="red"
                style={{ textAlign: 'center', marginLeft: '10px', borderRadius: '5px' }}
                onClick={cancelButton}
              >
                <h2>{cancelText}</h2>
              </Button>
            </Button.Group>
          </Grid.Column>

          <Grid.Column style={{ textAlign: 'right' }}>
            <Grid.Row>
              <Button.Group>
                <MechanicModal {...props} />
                <Button
                  className="ui button"
                  color="blue"
                  style={{ textAlign: 'center', margin: '5px', borderRadius: '5px' }}
                  onClick={() => printJobCard(props.job)}
                >
                  <h1>
                    <Icon name="print" />
                  </h1>
                  Job Card
                </Button>
              </Button.Group>
            </Grid.Row>

            <Grid.Row>
              <Button.Group>
                <PhoneModal job={props.job} />
                <SmsModal job={props.job} />
              </Button.Group>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

Summary.propTypes = {
  status: PropTypes.string.isRequired,
  jobNo: PropTypes.string.isRequired,
  bikeDetails: PropTypes.object.isRequired,
  services: PropTypes.array.isRequired,
  mechanic: PropTypes.string.isRequired,
  // pickupDate: PropTypes.date.isRequired,
  totalCost: PropTypes.number.isRequired,
  customerDetails: PropTypes.object.isRequired
}
export default Summary
