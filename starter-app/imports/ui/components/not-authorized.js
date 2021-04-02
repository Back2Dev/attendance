import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Typography, Link } from '@material-ui/core'

export default function NotAuthorized() {
  return (
    <div>
      <Typography variant="h1">Not authorised</Typography>
      <Typography>You don't have permission to view this page.</Typography>
      <Typography variant="h3">Why did this happen?</Typography>
      <Typography>There are a number of possible reasons for this...</Typography>
      <Link component={RouterLink} to="/">
        Back to homepage
      </Link>
    </div>
  )
}
