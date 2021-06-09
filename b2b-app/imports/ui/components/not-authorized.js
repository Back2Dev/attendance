import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { Typography, Link } from '@material-ui/core'

const StyledNotAuthorized = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

export default function NotAuthorized() {
  return (
    <StyledNotAuthorized>
      <Typography variant="h1" align="center">
        Not authorised
      </Typography>
      <Typography>You don't have permission to view this page.</Typography>
      <Typography variant="h3">Why did this happen?</Typography>
      <Typography>There are a number of possible reasons for this...</Typography>
      <Link component={RouterLink} to="/">
        Back to homepage
      </Link>
    </StyledNotAuthorized>
  )
}
