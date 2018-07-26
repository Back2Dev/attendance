import React from 'react'
import { Component } from 'react'
import { Card, Button, Container, List } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"
import { JOB_STATUS, JOB_STATUS_READABLE, JOB_STATUS_BUTTON } from '/imports/api/constants'
import printJobCart from '/imports/ui/assessment/assessment-print-job'
import Alert from 'react-s-alert'

class JobCard extends Component {

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
    const cancelButton = status <= JOB_STATUS.BIKE_PICKED_UP ? 'Cancel Job' : 'Re-open Job'
    
    return (
      <Card>
        <Container className="job-card-container" >
          <Card.Header style={{ textAlign: "Center", fontSize: "1.5em", margin: "20px" }} >
            Job Status:
            <br/>
            <div><strong>{jobStatus}</strong></div>
          </Card.Header>
          <Card.Content style={{ fontSize: "1em", marginLeft: "28px" }}>
            <List>
              <List.Item><strong>Customer Name: </strong>{this.titleCase(customerName)}</List.Item>
              <List.Item><strong>Bike Make: </strong>{make.toUpperCase()}</List.Item>
              <List.Item><strong>Bike Model: </strong>{model && model.toUpperCase()}</List.Item>
              <List.Item><strong>Bike Color: </strong>{this.titleCase(color)}</List.Item>
              <List.Item><strong>Services: </strong>{servicePackage}</List.Item>
              <List.Item><strong>Pickup Date: </strong>{pickUpDate}</List.Item>
              <List.Item><strong>Total Price: </strong>${totalRepairCost}</List.Item>
            </List>
          </Card.Content>
          <Container style={{ textAlign: "Center", margin: "20px 0" }}>
            <Button.Group style={{  width: "80%" }} vertical>
                <Button 
                  className="positive ui button"
                  style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }} 
                  onClick={this.updateButton} >
                    <h2>{statusButton}</h2>
                </Button>
                <Button 
                  className="positive ui button"
                  style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }}
                  onClick={() => printJobCart(this.props.currentJob)} >
                    <h2>Print Job Card</h2>
                </Button>
                <Button 
                  className="negative ui button"
                  style={{ marginTop: '5px', marginBottom: '5px', borderRadius: "5px" }}
                  onClick={this.cancelButton} >
                    <h2>{cancelButton}</h2>
                </Button>
            </Button.Group>
          </Container>
        </Container>
      </Card>
    )
  }
}

export default JobCard