import React, { Suspense, lazy } from 'react'
import { Grid } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

const SetupEvents = lazy(() => import('/imports/ui/setup/events'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function SetupPage() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Suspense fallback={<Loading loading />}>
          <Routes>
            <Route path="events/*" element={<SetupEvents />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Grid>
    </Grid>
  )
}
