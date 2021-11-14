import React, { useEffect, lazy } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'

import { Grid } from '@material-ui/core'
import GeneratedRoutes from '/imports/ui/routes/generated-routes'
import ManualRoutes from '/imports/ui/routes/manual-routes'
import NotFoundComponent from '/imports/ui/components/commons/not-found.js'

const StyledAdminPage = styled.div``

function AdminPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAdminPage className="admin-page-container">
      <Grid container>
        <Grid item xs={12}>
          <GeneratedRoutes />
          <ManualRoutes />
          {/* <Route component={NotFoundComponent} /> */}
        </Grid>
      </Grid>
    </StyledAdminPage>
  )
}

export default AdminPage
