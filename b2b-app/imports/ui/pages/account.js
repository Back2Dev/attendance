import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Grid } from '@mui/material'
import NotFoundComponent from '/imports/ui/components/commons/not-found.js'

const StyledAccountPage = styled.div``

function AccountPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAccountPage className="account-container">
      <Grid container>
        <Grid item xs={12}>
          <NotFoundComponent />
        </Grid>
      </Grid>
    </StyledAccountPage>
  )
}

export default AccountPage
