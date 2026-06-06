import React, { useContext } from 'react'
import styled from 'styled-components'

import { Skeleton } from '@mui/material';

import { SessionDetailsContext } from './context'

const StyledDetailsMap = styled.div`
  margin-top: 20px;
`

function DetailsMap() {
  const { loading, event, course } = useContext(SessionDetailsContext)
  if (loading || !event) {
    return (
      <StyledDetailsMap>
        <Skeleton variant="rectangular" height={300} />
      </StyledDetailsMap>
    );
  }

  if (!event.locationId || !course) {
    return null
  }
  return <StyledDetailsMap className="map" key={event.locationId}></StyledDetailsMap>

  // return event.course.map.map((item) => (
  //   <StyledDetailsMap className="map" key={item.title}>

  //     {/* <div className="map-title">{item.title}</div>
  //     <img src={item.imageUrl} alt={item.title} /> */}
  //   </StyledDetailsMap>
  // ))
}

export default DetailsMap
