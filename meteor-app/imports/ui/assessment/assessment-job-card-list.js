import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Search, Button } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'
import { JOB_STATUS_READABLE } from '/imports/api/constants'
import './assessment-job-card-list.css'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')

class JobCardList extends Component {
  state = {
    active: null
  }

  setButtonState = (status) => {
      this.setState({active: status.key});
      this.props.statusFilter(status)
  }
  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    const statusOptions = Object.keys(JOB_STATUS_READABLE).map(key => {
      return {
        key: key,
        value: JOB_STATUS_READABLE[key],
        text: JOB_STATUS_READABLE[key]
      }
    })
    return (
      <>
        <Nav />
        <Grid>
          <Grid.Row columns={2}>
        <Grid.Column>
        <div style={{marginLeft: "60px", marginTop: "20px"}}>
          <Button.Group basic id="button-parent">
          {statusOptions.map((status) =>  
            <Button
              toggle
              className={this.state.active === status.key ? 'active' : ''}            
              key={status.key}
              value={status.value}
              onClick={() => this.setButtonState(status)}
            >
            {status.text}
            </Button>
          )}
          </Button.Group>
        </div>
        </Grid.Column>
        <Grid.Column>
        <div style={{textAlign: "right", marginRight: "60px", marginTop: "20px"}}>
          <Search
            open={false}
            fluid
            onSearchChange={this.props.searchFind}
            type='text'
            size='large'
            placeholder='Enter bike make/color or customer name'/>
        </div>
        </Grid.Column>
        </Grid.Row>
        </Grid>

        <Grid style={{marginLeft: "60px", marginRight: "60px" }}>
          {this.props.jobs.map(job =>
            <Grid.Row key={job._id}>
              <JobCard
                currentJob={job}
                updateStatus={this.props.updateStatus}
              />
            </Grid.Row>
          )}
        </Grid>
      </>
    )
  }
}

export default withTracker(props => {
  Meteor.subscribe('assessments.all')
  
  const searchLine = searchVar.get()
  const statusLine = statusVar.get()
  
  const searchFind = event => {
    const value = event.target.value
    searchVar.set(value)
  }

  const statusFilter = (status) => {
    const statusValue = Object.keys(JOB_STATUS_READABLE)
    .filter(key => {
        return key === status.key
    })
    .map(value => parseInt(value))
    statusVar.set(statusValue)
  }
 

  const updateStatus = (jobId, updatedStatus) => {
    Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
  }

  const renderJob = () => {
    if (statusLine == '') {
      return Assessment.find({ search: { $regex: searchLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } }).fetch()
    }
    return Assessment.find({ search: { $regex: searchLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i"  }, status: { $in: statusLine } }).fetch()
  }

  return {
    jobs: renderJob(),
    searchFind,
    statusFilter,
    updateStatus,
  }
})(JobCardList)