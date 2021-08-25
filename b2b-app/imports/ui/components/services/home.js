import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Typography, Button } from '@material-ui/core'

import { JobsListingProvider } from './listing/context'
import JobsListing from './listing/listing'

const StyledServicingHome = styled.div`
  margin: 60px auto;
  .jobs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      margin: 20px 0;
    }
  }
`

function ServicingHome() {
  const { push } = useHistory()
  return (
    <JobsListingProvider>
      <StyledServicingHome>
        <div className="jobs-header">
          <Typography variant="h1" align="left">
            Jobs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => push('/services/new')}
            data-cy="create-job"
          >
            Create Job
          </Button>
        </div>
        <JobsListing />
      </StyledServicingHome>
    </JobsListingProvider>
  )
}

export default ServicingHome
