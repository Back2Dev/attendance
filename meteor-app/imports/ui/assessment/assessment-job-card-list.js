import React from 'react'
import { Component } from 'react';
import { Grid, Search, Button, Loader } from 'semantic-ui-react'
import JobCard from '/imports/ui/assessment/assessment-job-card'
import Nav from '/imports/ui/ordering/navbar'
import { JOB_STATUS_READABLE, JOB_STATUS } from '/imports/api/constants'
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
        <Grid stackable textAlign="center" style={{marginLeft: "50px", marginRight: "50px", marginTop: "20px" }}>
          <Grid.Row columns={3}>

            <Grid.Column computer={10} tablet={16} textAlign="left">
                <Button.Group basic id="button-parent" className="ui stackable buttons">
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
            </Grid.Column>

            <Grid.Column computer={4} tablet={8}>
                <Search
                  open={false}
                  onSearchChange={this.searchJobs}
                  type='text'
                  size='large'
                  placeholder='Search'/>
            </Grid.Column>

            <Grid.Column computer={2} tablet={4}>
                <Button
                  color="blue"
                  onClick={() => {
                    this.props.history.push("/history");
                  }}>
                  Archive
                </Button>
            </Grid.Column>

          </Grid.Row>
        </Grid>

        <Grid style={{marginLeft: "50px", marginRight: "50px" }}>
          <Grid.Row centered>
            <h1>Current Jobs</h1>
          </Grid.Row>
          
          {
          this.props.jobs
          .filter(job => job.status <= JOB_STATUS.READY_FOR_PICK_UP)
          .map(job =>
            <Grid.Row 
              key={job._id}
              onClick={() => this.setCurrentJob(job)}
            >
              <JobCard
                job={job}
                updateStatus={this.props.updateStatus}
                logs={this.props.logs}
                currentJob={this.state.job}
                members={this.props.members}
              />
            </Grid.Row>
          )}
        </Grid>
      </React.Fragment>
    )
  }
}

export default JobCardList