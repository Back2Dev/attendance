import React, { useEffect, lazy } from 'react'
import styled from 'styled-components'

import { Grid } from '@mui/material'
import GeneratedRoutes from '/imports/ui/routes/generated-routes'
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
          {/* <Route component={NotFoundComponent} /> */}
        </Grid>
      </Grid>
    </StyledAdminPage>
  )
}

export default AdminPage
