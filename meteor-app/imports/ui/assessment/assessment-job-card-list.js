import React from 'react'
import { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import { withRouter } from 'react-router-dom'
import Nav from '/imports/ui/ordering/navbar'



class JobCardList extends Component {


  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    const currentJobs = [{
              _id: "0",
              jobStatus: "Not Completed",
              make: "Toyota",
              model: "Corolla",
              color: "Red",
              serviceLevel: "Minor",
              pickUp: "25/07/2018",
              cost: "50"
              },
              {
                _id: "1",
                jobStatus: "Not Completed",
                make: "Toyota",
                model: "Corolla",
                color: "Red",
                serviceLevel: "Minor",
                pickUp: "25/07/2018",
                cost: "50"
                }]

    return(
      <>
      <Nav />
        <Grid stackable>
          {currentJobs.map(job =>
            <Grid.Column key={job._id} width={4}>
                <JobCard
                  currentJob={job}
                />
            </Grid.Column>
          )}
        </Grid>
      </>
    )
  }
}

export default withRouter(JobCardList)

