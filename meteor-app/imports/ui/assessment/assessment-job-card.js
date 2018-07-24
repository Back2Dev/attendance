import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react'
import { Card, Button, Container, List } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"
import { JOB_STATUS, JOB_STATUS_BUTTON } from '/imports/api/constants'


class JobCard extends Component {

  updateButton = () => {
    const jobId = this.props.currentJob._id
    const status = this.props.currentJob.status
    const updatedStatus = status+1

    try {
      if (status >= 5) return
      Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
    } catch (error) {
      throw new Meteor.Error(error)
    }
  }

  cancelButton = () => {
    const jobId = this.props.currentJob._id
    const status = this.props.currentJob.status
    const cancelStatus = 6
    const reopenStatus = 1
    try {
      if (status < 5) {
        Meteor.call('assessment.updateJobStatus', jobId, cancelStatus)
      } else if(status === 6) {
        Meteor.call('assessment.updateJobStatus', jobId, reopenStatus)
      }
      return
    } catch (error) {
      throw new Meteor.Error(error)
    }
  }

  render() {
    // Pulling data from props (assessment collection)
    const job = this.props.currentJob
    const make = job.bikeDetails.make
    const model = job.bikeDetails.model
    const color = job.bikeDetails.color
    const pickupDate = job.pickupDate.toLocaleDateString()
    const totalCost = job.totalCost/100
    const status = JOB_STATUS[job.status]
    const serviceList = job.services.serviceItem.map(item => (<li key={item.name} style={{textIndent: "10px"}}>{item.name}</li>))
    const servicePackage = job.baseService

    // Dynamic button name
    const statusButton = job.status <= 5 ? JOB_STATUS_BUTTON[job.status] : 'Order Cancelled'
    const cancelButton = job.status <= 5 ? 'Cancel Job' : 'Re-open Job'
    
    return (
      <Card>
        <Container className="job-card-container" >
          <Card.Header style={{ textAlign: "Center", fontSize: "1.5em", margin: "20px" }} >
            Job Status: <strong>{status}</strong>
          </Card.Header>
          <Card.Content style={{ fontSize: "1em", marginLeft: "15px" }}>
            <List>
              <List.Item><strong>Bike Make: </strong>{make}</List.Item>
              <List.Item><strong>Bike Model: </strong>{model}</List.Item>
              <List.Item><strong>Bike Color: </strong>{color}</List.Item>
              {/* <List.Item><strong>Services: </strong>{servicePackage}</List.Item> */}
              <List.Item><strong>Pickup Date: </strong>{pickupDate}</List.Item>
              <List.Item><strong>Total Price: </strong>${totalCost}</List.Item>
            </List>
          </Card.Content>
          <Container style={{ textAlign: "Center", margin: "20px 0" }}>
            <Button.Group style={{  width: "80%" }} vertical>
                <Button 
                  className="positive ui button"
                  style={{ marginTop: '5px', marginBottom: '5px' }} 
                  onClick={this.updateButton} >
                    <h2>{statusButton}</h2>
                </Button>
                <Button 
                  className="positive ui button"
                  style={{ marginTop: '5px', marginBottom: '5px' }} >
                    <h2>Print Job Card</h2>
                </Button>
                <Button 
                  className="negative ui button"
                  style={{ marginTop: '5px', marginBottom: '5px' }}
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