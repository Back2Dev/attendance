import React, { useContext } from 'react'
import styled from 'styled-components'

import { Skeleton } from '@material-ui/lab'

import { SessionDetailsContext } from './context'

const StyledDetailsContent = styled.div`
  margin-top: 20px;
`

function DetailsContent() {
  const { loading, event } = useContext(SessionDetailsContext)

  if (loading || !event) {
    return (
      <StyledDetailsContent>
        <Skeleton variant="rect" height={300} />
      </StyledDetailsContent>
    )
  }

  return (
    <StyledDetailsContent className="content">
      <Skeleton variant="rect" height={300} animation={false} />
    </StyledDetailsContent>
  )
}

export default DetailsContent
