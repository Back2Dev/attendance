import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Component } from 'react';
import { Grid, Search, Button, Loader } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { withTracker } from "meteor/react-meteor-data";
import Assessment from '/imports/api/assessments/assessment'
import Members from '/imports/api/members/members'
import Logger from '/imports/api/assessments/logger'
import { JOB_STATUS_READABLE, JOB_STATUS, JOB_STATUS_ALL } from '/imports/api/constants'
import './assessment-job-card-list.css'



class JobCardList extends Component {
  state = {
    active: null,
    showAll: true,
    job: {}
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

  componentDidUpdate(status) {
    if(status === JOB_STATUS_ALL){
      this.setState({
        showAll: true,
        active: null
      })
    }
  }

  componentWillUnmount() {
      this.props.resetStatus()
  }

  setCurrentJob = (job) => {
    this.setState({
      job,
    }, () => {
      this.props.changeAssId(job._id)
    })
  }
  // all props being passed to JobCard need to be changed to the actual data from the db
  render() {
    if(this.props.loading){
      return <Loader active />
    }
    const statusOptions = Object.keys(JOB_STATUS_READABLE)
    .filter(key => key <= JOB_STATUS.READY_FOR_PICK_UP)
    .map(key => {
      return {
        key: key,
        value: JOB_STATUS_READABLE[key],
        text: JOB_STATUS_READABLE[key]
      }
    })
    return (
      <React.Fragment>
        <Nav />
        <Grid stackable>
          <Grid.Row columns={3}>
            <Grid.Column width={8}>
              <div style={{marginLeft: "50px", marginTop: "20px"}}>
                <Button.Group basic id="button-parent">
                  <Button
                      toggle
                      className={this.state.showAll ? 'active' : ''}            
                      value='all'
                      onClick={() => this.setButtonState('all')}
                    >
                    All
                  </Button>
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

            <Grid.Column width={2}>
              <div style={{marginRight: "50px", marginTop: "20px"}}>
                <Button
                  color="blue"
                  onClick={() => {
                    this.props.history.push("/history");
                  }}>
                  Archive
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid style={{marginLeft: "50px", marginRight: "50px" }}>
          <Grid.Row centered>
            <h1>Current Jobs</h1>
          </Grid.Row>
          {this.props.jobs
          .filter(job => job.status <= JOB_STATUS.READY_FOR_PICK_UP)
          .map(job =>
            <Grid.Row 
              key={job._id}
              onClick={() => this.setCurrentJob(job)}
            >
              <JobCard
                job={job}
                currentJob={this.state.job}
                {...this.props}
              />
            </Grid.Row>
          )}
        </Grid>
      </React.Fragment>
    )
  }
}

export default JobCardList