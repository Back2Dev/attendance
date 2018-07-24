import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'

class JobCardList extends Component {
  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {

    return(
      <>
        <Nav />
        <Grid stackable>
          {this.props.jobs.map(job =>
            <Grid.Column key={job._id} width={5}>
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

  return {
    jobs: Assessment.find().fetch(),
  }
})(JobCardList)