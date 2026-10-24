import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Custom RJSF ObjectFieldTemplate — arranges event form fields in a clean grid layout
export default function EventFormTemplate({ properties, title, description }) {
  const f = (name) => {
    const prop = properties.find((p) => p.name === name)
    return prop ? prop.content : null
  }

  return (
    <Grid container spacing={2}>
      {/* Row 1: Event name */}
      <Grid item xs={12}>
        {f('name')}
      </Grid>

      {/* Row 2: Date/Time, Duration, Price */}
      <Grid item xs={6}>
        {f('when')}
      </Grid>
      <Grid item xs={3}>
        {f('duration')}
      </Grid>
      <Grid item xs={3}>
        {f('price')}
      </Grid>

      {/* Row 3: Status, Location, Backup */}
      <Grid item xs={3}>
        {f('status')}
      </Grid>
      <Grid item xs={5}>
        {f('locationId')}
      </Grid>
      <Grid item xs={4}>
        {f('backupLocationId')}
      </Grid>

      {/* Row 4: Description */}
      <Grid item xs={12}>
        {f('description')}
      </Grid>

      {/* Row 5: Public checkbox */}
      <Grid item xs={12}>
        {f('public')}
      </Grid>
    </Grid>
  )
}
