import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { Typography } from '@material-ui/core'

const StyledPublicProfile = styled.div``

function PublicProfile() {
  const { id } = useParams()

  return (
    <StyledPublicProfile>
      <Typography variant="h1">Public Profile {id}</Typography>
    </StyledPublicProfile>
  )
}

export default PublicProfile
