import React from 'react'
import styled from 'styled-components'

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
        <JobHistory />
        <JobServiceItems />
      </JobsDetailsProvider>
    </StyledJobDetails>
  )
}

export default JobDetails
