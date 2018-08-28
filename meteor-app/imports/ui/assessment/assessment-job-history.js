import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Search, Button } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'
import Members from '/imports/api/members/members'
import Logger from '/imports/api/assessments/logger'
import { JOB_STATUS_READABLE, JOB_STATUS, JOB_STATUS_COMPLETE } from '/imports/api/constants'
import './assessment-job-card-list.css'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')

class JobHistory extends Component {
  state = {
    active: null,
    showAll: true,
  }

  setButtonState = (status) => {
    if(status === 'all'){
      this.setState({
        showAll: true,
        active: null
      });
      this.props.statusFilter(status)
    } else {
      this.setState({
        active: status.key,
        showAll: false,
      });
      this.props.statusFilter(status)
    }
  }

  componentWillUnmount() {
      this.props.resetStatus()
  }

  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    const statusOptions = Object.keys(JOB_STATUS_READABLE)
    .filter(key => key >= JOB_STATUS.PICKED_UP)
    .map(key => {
      return {
        key: key,
        value: JOB_STATUS_READABLE[key],
        text: JOB_STATUS_READABLE[key]
      } 
    })

    return (
      <>
        <Nav />
        <Grid stackable>
          <Grid.Row columns={3}>
            <Grid.Column width={7}>
              <div style={{marginLeft: "50px", marginTop: "20px"}}>
                <Button.Group basic id="button-parent">
                  <Button
                      toggle
                      className={this.state.showAll ? 'active' : ''}            
                      value='all'
                      onClick={() => this.setButtonState('all')}>
                    All
                  </Button>
                  {statusOptions
                  .map((status) => 
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

            <Grid.Column width={6}>
              <div style={{textAlign: "right", marginRight: "50px", marginTop: "20px"}}>
                <Search
                  open={false}
                  fluid
                  onSearchChange={this.props.searchFind}
                  type='text'
                  size='large'
                  placeholder='Enter bike make/color or customer name'/>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div style={{ textAlign: "right", marginRight: "50px", marginTop: "20px"}}>
                <Button
                    color="blue"
                    onClick={() => {
                      this.props.history.push("/jobs");
                    }}>
                    Current Jobs
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid style={{marginLeft: "50px", marginRight: "50px" }}>
          <Grid.Row centered>
            <h1>Archive</h1>
          </Grid.Row>
          
          {this.props.jobs
          .filter(job => job.status >= JOB_STATUS.PICKED_UP)
          .map(job =>
            <Grid.Row key={job._id}>
              <JobCard
                currentJob={job}
                updateStatus={this.props.updateStatus}
                members={this.props.members}
                log={this.props.log}
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
  Meteor.subscribe('all.members')
  Meteor.subscribe('logger.assessment')

  const searchLine = searchVar.get()
  const statusLine = statusVar.get()
  
  const searchFind = event => {
    const value = event.target.value
    resetStatus()
    searchVar.set(value)
  }

  const statusFilter = (status) => {
    let statusValue
    if(status === 'all'){
      statusValue = JOB_STATUS_COMPLETE
    } else {
      statusValue = Object.keys(JOB_STATUS_READABLE) // [ "1","2","3","4","5" ]
        .filter(key => key === status.key) // ["1"]
        .map(value => parseInt(value)) // [1]
  }
  statusVar.set(statusValue)
  }

  const resetStatus = () => {
    statusVar.set(JOB_STATUS_COMPLETE)
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
    members: Members.find().fetch(),
    log: Logger.find().fetch(), 
    searchFind,
    statusFilter,
    updateStatus,
    resetStatus
  }
})(JobHistory)