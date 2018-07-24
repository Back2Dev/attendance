import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Input, Icon, Search } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'

const searchFilter = new ReactiveVar('')
const statusFilter = new ReactiveVar('')

class JobCardList extends Component {

  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {

    return(
      <>
        <Nav />
        <div style={{margin: "10px"}}>
          <Search
            onSearchChange={this.props.searchFind}
            type='text'
            size='big'
            placeholder='Looking for something?'/>
        </div>
        <Grid stackable >
          {this.props.jobs.map(job =>
            <Grid.Column key={job._id} mobile={5} tablet={5} computer={4}>
              <JobCard
                currentJob={job}
                updateJob={this.props.updateJob}
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
  
  const searchLine = searchFilter.get()
  const statusLine = statusFilter.get()
  const searchFind = event => {
    const value = event.target.value
    searchFilter.set(value)
    statusFilter.set(value)
  }

  return {
    jobs: Assessment.find({ search: { $regex: searchLine } }).fetch(),
    searchFind,
  }
})(JobCardList)