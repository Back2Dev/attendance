import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Typography, Button } from '@material-ui/core'

const StyledServicingHome = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

function ServicingHome() {
  const { push } = useHistory()
  return (
    <StyledServicingHome>
      <Typography variant="h1" align="center">
        Servicing Home
      </Typography>
      <Button variant="contained" color="primary" onClick={() => push('/services/new')}>
        Create Service
      </Button>
    </StyledServicingHome>
  )
}

export default ServicingHome
