import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

const StyledMemberPortal = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

function MemberPortal() {
  return (
    <StyledMemberPortal>
      <Typography variant="h1" align="center">
        Member Portal
      </Typography>
    </StyledMemberPortal>
  )
}

export default MemberPortal
