import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Alert from '/imports/ui/utils/alert'
import {
  Button,
  List,
  Accordion,
  Icon,
  Grid,
} from 'semantic-ui-react'

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
  LOG_EVENT_TYPES,
  PAID,
  UNPAID,
} from '/imports/api/constants'
import printJobCard from '/imports/ui/assessment/assessment-print-job'
import MechanicModal from './mechanic-modal'
import SmsModal from './sms-modal'
import PhoneModal from './phone-modal'

const JobCard = ({
  job,
  updatePaid,
  updateStatus,
  logs,
  members,
  completeJob,
  selectedaId,
}) => {
  const [activeIndex, setActive] = React.useState(-1)
  React.useEffect(() => {
    if (selectedaId !== job._id) setActive(-1)
  }, [selectedaId])

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActive(newIndex)
  }

  const markAsPaid = (job) => {
    updatePaid(job._id)
  }

  const completeItem = (e, id) => {
    e.preventDefault()
    completeJob(id)
  }

  const updateButton = () => {
    const jobId = job._id
    const statusValue = job.status
    const statusList = Object.keys(JOB_STATUS)
    const status = statusList.find(
      (key) => JOB_STATUS[key] === statusValue
    ) // Find key/name of current status
    const statusIndex = statusList.findIndex(
      (element) => element === status
    )
    const updatedStatusKey = statusList[statusIndex + 1] // Find key/name of next status
    const updatedStatus = JOB_STATUS[updatedStatusKey] // Update to the next status

    try {
      if (statusValue >= JOB_STATUS.PICKED_UP) return
      updateStatus(jobId, updatedStatus)
      Alert.success(
        `Successfully changed job status to ${JOB_STATUS_READABLE[updatedStatus]}`
      )
    } catch (error) {
      Alert.error(error.message)
    }
  }

  const cancelButton = () => {
    const jobId = job._id
    const status = job.status
    const cancelStatus = JOB_STATUS.CANCELLED
    const completeStatus = JOB_STATUS.PICKED_UP
    const reopenStatus = JOB_STATUS.NEW
    const bikePickedUpStatus = JOB_STATUS.PICKED_UP
    try {
      if (status < bikePickedUpStatus) {
        updateStatus(jobId, cancelStatus)
        Alert.success(
          `Successfully changed job status to ${JOB_STATUS_READABLE[cancelStatus]}`
        )
      } else if (
        status === cancelStatus ||
        status === completeStatus
      ) {
        updateStatus(jobId, reopenStatus)
        Alert.success(
          `Successfully changed job status to ${JOB_STATUS_READABLE[reopenStatus]}`
        )
      }
      return
    } catch (error) {
      Alert.error(error.message)
    }
  }

  const sendSMS = (cost) => {}

  const callCustomer = (cost) => {
    const jobId = job._id
  }

  const titleCase = (str) => {
    if (!str) return
    return str
      .toLowerCase()
      .split(' ')
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(' ')
  }

  const renderLogs = (logs) => {
    return logs.map((log, ix) => {
      const date = moment(log.createdAt).format('ddd Do MMM, h:mm a')
      return <li key={ix}>{`${date} - ${log.what}`}</li>
    })
  }

  // Pulling data from props (assessment collection)
  const {
    _id,
    status,
    jobNo,
    make,
    model,
    color,
    assessor,
    mechanic,
    serviceItems,
    pickupDate,
    totalCost,
    isRefurbish,
  } = job
  const pickupDisplay = moment(pickupDate).format('D/M/YYYY')
  const totalRepairCost = totalCost / 100
  const jobStatus = JOB_STATUS_READABLE[status]
  const customerName = isRefurbish ? 'Refurbish' : job.name
  // const serviceList = services.serviceItem.map(item => (<li key={item.name} style={{textIndent: "10px"}}>{item.name}</li>))

  // Dynamic button name
  const statusText =
    status <= JOB_STATUS.PICKED_UP
      ? JOB_STATUS_BUTTON[status]
      : 'Cancelled'
  const cancelText =
    status <= JOB_STATUS.READY_FOR_PICK_UP
      ? 'Cancel Job'
      : 'Re-open Job'
  const name = `${jobNo} ${titleCase(color)} ${make} ${model}`
  const servicePackage = serviceItems.map((item) => item.name)

  return (
    <Accordion className="job-card-container" styled fluid>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
        style={JOB_STATUS_STYLES[status]}
      >
        <Grid stackable>
          <Grid.Row columns={5} mobile={2}>
            <Grid.Column width={1}>
              <Icon name="dropdown" />
            </Grid.Column>

            <Grid.Column width={3}>
              <div>
                <strong>{jobStatus}</strong>
              </div>
            </Grid.Column>

            <Grid.Column width={6}>
              <List.Item>{name}</List.Item>
            </Grid.Column>

            <Grid.Column width={4}>
              <List.Item>{titleCase(customerName)}</List.Item>
            </Grid.Column>

            <Grid.Column width={2}>
              <List.Item align="right">${totalRepairCost}</List.Item>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Accordion.Title>

      <Accordion.Content
        active={activeIndex === 0}
        style={{ fontSize: '1em', marginLeft: '28px' }}
      >
        <Grid stackable>
          <Grid.Row columns={2} style={{ marginTop: '20px' }}>
            <Grid.Column style={{ fontSize: '1.2em' }}>
              <List.Item>
                <strong>{servicePackage.join(', ')}</strong>
                <br />
                <strong>Due: </strong> {pickupDisplay}
                <br />
                <strong>Mechanic: </strong>
                {mechanic}
              </List.Item>
              <ul>
                <strong>Activity: </strong>
                {renderLogs(logs)}
              </ul>
              <br />
              <Button.Group>
                <Button
                  className="ui button"
                  color="green"
                  style={{
                    textAlign: 'center',
                    borderRadius: '5px',
                    width: '200px',
                  }}
                  onClick={updateButton}
                >
                  <h2>{statusText}</h2>
                </Button>
                <Button
                  className="ui button"
                  color="red"
                  style={{
                    textAlign: 'center',
                    marginLeft: '10px',
                    borderRadius: '5px',
                  }}
                  onClick={cancelButton}
                >
                  <h2>{cancelText}</h2>
                </Button>
                {job.status < JOB_STATUS.PICKED_UP && (
                  <Button
                    enabled={!job.paid}
                    className="ui button"
                    color="red"
                    style={{
                      textAlign: 'center',
                      marginLeft: '10px',
                      borderRadius: '5px',
                    }}
                    onClick={(e) => completeItem(e, _id)}
                  >
                    <h2>Complete Job</h2>
                  </Button>
                )}
              </Button.Group>
            </Grid.Column>

            <Grid.Column style={{ textAlign: 'right' }}>
              <Grid.Row>
                <Button.Group>
                  <Button
                    enabled={!job.paid}
                    className="ui button"
                    color={job.paid ? 'green' : 'red'}
                    style={{
                      textAlign: 'center',
                      margin: '5px',
                      borderRadius: '5px',
                    }}
                    onClick={() => markAsPaid(job)}
                  >
                    <h1>
                      <Icon name={job.paid ? 'check' : 'dollar'} />
                    </h1>
                    {job.paid ? 'Paid' : 'Mark as paid'}
                  </Button>
                  <MechanicModal currentJob={job} members={members} />
                  <Button
                    className="ui button"
                    color="blue"
                    style={{
                      textAlign: 'center',
                      margin: '5px',
                      borderRadius: '5px',
                    }}
                    onClick={() => printJobCard(job)}
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
                  <PhoneModal job={job} />
                  <SmsModal job={job} />
                </Button.Group>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Accordion.Content>
    </Accordion>
  )
}

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }),
  updateStatus: PropTypes.func.isRequired,
  completeJob: PropTypes.func.isRequired,
  logs: PropTypes.array.isRequired,
  selectedaId: PropTypes.string,
}

export default JobCard
