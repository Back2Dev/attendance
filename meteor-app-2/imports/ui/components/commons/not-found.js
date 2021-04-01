import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { Typography, Grid, Link } from '@material-ui/core'

const StyledNotFound = styled.div`
  text-align: center;
  padding: 0;
`

function NotFoundComponent() {
  return (
    <StyledNotFound className="not-found">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h1">404 Not found</Typography>
          <Typography variant="body1">
            The page you&#39;re looking for was not found.
            <br />
            <Link component={RouterLink} to="/">
              Back to homepage
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </StyledNotFound>
  )
}

export default NotFoundComponent
