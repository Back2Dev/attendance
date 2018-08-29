import React from 'react'
import { Component } from 'react';
import { Grid, Search, Button } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { JOB_STATUS_READABLE, JOB_STATUS} from '/imports/api/constants'
import './assessment-job-card-list.css'


class JobHistoryList extends Component {
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

  componentWillUnmount() {
      this.props.resetStatus()
  }

  searchJobs = (e) => {
    const {value} = e.target
    
    this.setState({
      active: null,
      showAll: true,
    })
    this.props.searchFind(value)
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
      <React.Fragment>
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
                  onSearchChange={this.searchJobs}
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
            <Grid.Row 
            key={job._id}
            onClick={() => this.setCurrentJob(job)}
          >
              <JobCard
                job={job}
                currentJob={this.state.job}
                updateStatus={this.props.updateStatus}
                members={this.props.members}
                logs={this.props.logs}
              />
            </Grid.Row>
          )}
        </Grid>
      </React.Fragment>
    )
  }
}

export default JobHistoryList