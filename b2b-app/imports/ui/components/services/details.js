import React from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'

import { JobsDetailsProvider } from './details/context'
import JobInfo from './details/info'
import JobActions from './details/actions'
import JobHistory from './details/history'
import JobServiceItems from './details/service-items'

const StyledJobDetails = styled.div`
  margin: 40px 0;
`

function JobDetails() {
  return (
    <StyledJobDetails>
      <JobsDetailsProvider>
        <JobInfo />
        <JobActions />
        <Grid container>
          <Grid item xs={12} md={7}>
            <JobHistory />
          </Grid>
          <Grid item xs={12} md={5}>
            <JobServiceItems />
          </Grid>
        </Grid>
      </JobsDetailsProvider>
    </StyledJobDetails>
  )
}

export default JobDetails
