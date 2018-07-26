import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Search, Dropdown } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'
import { JOB_STATUS_READABLE } from '/imports/api/constants'
import './assessment-job-card-list.css'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')

class JobCardList extends Component {

  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    const statusOptions = Object.keys(JOB_STATUS_READABLE).map(key => {
      return {
        key: JOB_STATUS_READABLE[key],
        value: JOB_STATUS_READABLE[key],
        text: JOB_STATUS_READABLE[key]
      }
    })
    const preSelection = Object.values(JOB_STATUS_READABLE)
    
    return (
      <>
        <Nav />
        <div style={{margin: "10px"}}>
          <Search
            open={false}
            fluid
            onSearchChange={this.props.searchFind}
            type='text'
            size='large'
            placeholder='Enter bike make/color or customer name'/>
        </div>
        <div style={{margin: "10px"}}>
          <Dropdown 
            placeholder='Job Status' 
            multiple 
            search 
            selection 
            defaultValue={preSelection}
            options={statusOptions} 
            onChange={this.props.statusFilter} />
        </div>
        <Grid stackable >
          {this.props.jobs.map(job =>
            <Grid.Column key={job._id} mobile={5} tablet={5} computer={4}>
              <JobCard
                currentJob={job}
                updateStatus={this.props.updateStatus}
              />
            </Grid.Column>
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

  const statusFilter = (event, data) => {
    const value = Array.isArray(data.value) ? data.value : [data.value]
    const statusValue = Object.keys(JOB_STATUS_READABLE)
      .filter(key => {
        for (let i = 0; i < value.length; i++) {
          if (JOB_STATUS_READABLE[key] === value[i]) return key
        }
      })
      .map(value => parseInt(value))
    statusVar.set(statusValue)
  }

  const updateStatus = (jobId, updatedStatus) => {
    Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
  }

  const renderJob = () => {
    if (statusLine == '') {
      return Assessment.find({ search: { $regex: searchLine } }).fetch()
    }
    return Assessment.find({ search: { $regex: searchLine }, status: { $in: statusLine } }).fetch()
  }

  return {
    jobs: renderJob(),
    searchFind,
    statusFilter,
    updateStatus,
  }
})(JobCardList)