import React, { useContext } from 'react'
import styled from 'styled-components'

import { Skeleton } from '@material-ui/lab'

import { SessionDetailsContext } from './context'

const StyledDetailsMap = styled.div`
  margin-top: 20px;
  img {
    max-width: 100%;
  }
`

function DetailsMap() {
  const { loading, course } = useContext(SessionDetailsContext)

  if (loading || !course) {
    return (
      <StyledDetailsMap>
        <Skeleton variant="rect" height={300} />
      </StyledDetailsMap>
    )
  }

  if (!course.map) {
    return null
  }

  return (
    <StyledDetailsMap className="map">
      <img src={course.map} alt="map" />
    </StyledDetailsMap>
  )
}

export default DetailsMap
