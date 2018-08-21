import React from 'react'
import PropTypes from 'prop-types';
import { Component } from 'react'
import { Card, Button, Container, List, Accordion, Icon, Grid } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"
import { JOB_STATUS, JOB_STATUS_READABLE, JOB_STATUS_BUTTON } from '/imports/api/constants'
import printJobCart from '/imports/ui/assessment/assessment-print-job'
import Alert from 'react-s-alert'


class JobCard extends Component {
  state = { activeIndex: -1 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  updateButton = () => {
    const jobId = this.props.currentJob._id
    const statusValue = this.props.currentJob.status
    const statusList = Object.keys(JOB_STATUS)
    const status = statusList.find(key => JOB_STATUS[key] === statusValue) // Find key/name of current status
    const statusIndex = statusList.findIndex(element => element === status)
    const updatedStatusKey = statusList[statusIndex+1] // Find key/name of next status
    const updatedStatus = JOB_STATUS[updatedStatusKey] // Update to the next status 

    try {
      if (statusValue >= JOB_STATUS.BIKE_PICKED_UP) return
      this.props.updateStatus(jobId, updatedStatus)
    } catch (error) {
      Alert.error(error.message)
    }
  }

  cancelButton = () => {
    const jobId = this.props.currentJob._id
    const status = this.props.currentJob.status
    const cancelStatus = JOB_STATUS.CANCELLED
    const reopenStatus = JOB_STATUS.NEW
    const bikePickedUpStatus = JOB_STATUS.BIKE_PICKED_UP
    try {
      if (status < bikePickedUpStatus) {
        this.props.updateStatus(jobId, cancelStatus)
      } else if(status === cancelStatus) {
        this.props.updateStatus(jobId, reopenStatus)
      }
      return
    } catch (error) {
      Alert.error(error.message)
    }
  }

  titleCase(str) {
    if (!str) return
    return str.toLowerCase().split(' ').map(x => x[0].toUpperCase()+x.slice(1)).join(' ');
  }

  render() {
    const { activeIndex } = this.state
    // Pulling data from props (assessment collection)
    const { status, bikeDetails, services, pickupDate, totalCost, customerDetails } = this.props.currentJob
    const make = bikeDetails.make
    const model = bikeDetails.model
    const color = bikeDetails.color
    const pickUpDate = pickupDate.toLocaleDateString()
    const totalRepairCost = totalCost/100
    const jobStatus = JOB_STATUS_READABLE[status]
    const refurbishBike = customerDetails.refurbishment
    const customerName = refurbishBike ? 'Back2Bikes' : customerDetails.name
    // const serviceList = services.serviceItem.map(item => (<li key={item.name} style={{textIndent: "10px"}}>{item.name}</li>))
    const servicePackage = services.baseService

    // Dynamic button name
    const statusButton = status <= JOB_STATUS.BIKE_PICKED_UP ? JOB_STATUS_BUTTON[status] : 'Order Cancelled'
    const cancelButton = status <= JOB_STATUS.BIKE_PICKED_UP ? <Icon name="times"/> : <Icon name="bicycle"/>
    
    return (
      <Accordion className="job-card-container" styled fluid>
      
        <Accordion.Title 
          active={activeIndex === 0} 
          index={0} onClick={this.handleClick} 
          style={{backgroundColor: "lightblue",fontSize: "1.5em"}}
        >
          <Grid>
            <Grid.Row columns={5}>

            <Grid.Column>
              <Icon name='dropdown' />
            </Grid.Column>

            <Grid.Column>
              <div><strong>{jobStatus}</strong></div>
            </Grid.Column>

            <Grid.Column>            
              <List.Item>{this.titleCase(color)} {make} {model}</List.Item>
            </Grid.Column>

            <Grid.Column>            
              <List.Item>{this.titleCase(customerName)}</List.Item>
            </Grid.Column>

            <Grid.Column>            
              <List.Item>${totalRepairCost}</List.Item>
            </Grid.Column>

            </Grid.Row>
          </Grid>
        </Accordion.Title>

        <Accordion.Content active={activeIndex === 0} style={{ fontSize: "1em", marginLeft: "28px" }}>
          <Grid>
          <Grid.Row columns={2}>
          <Grid.Column>
            <List.Item><strong>Services: </strong>{servicePackage}</List.Item>
            <List.Item><strong>Pickup Date: </strong>{pickUpDate}</List.Item>
          </Grid.Column>

          <Grid.Column>
          <Button.Group>
              <Button 
                className="positive ui button"
                style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }} 
                onClick={this.updateButton} >
                  <h2>{statusButton}</h2>
              </Button>
              <Button 
                className="ui button"
                color="blue"
                style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }}
                onClick={() => printJobCart(this.props.currentJob)} >
                  <Icon name="print" />
              </Button>
              <Button 
                className="negative ui button"
                style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }}
                onClick={this.cancelButton} >
                <h2>{cancelButton}</h2>
              </Button>
          </Button.Group>
          </Grid.Column>
          </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Accordion>
    )
  }
}


JobCard.propTypes = {
  currentJob: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
  }),
  updateStatus: PropTypes.func.isRequired,
};

export default JobCard