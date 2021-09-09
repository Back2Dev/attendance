import React, { useContext } from 'react'
import styled from 'styled-components'
import PageDisplay from '/imports/ui/admin/courses/components/PageDisplay'


import { Skeleton } from '@material-ui/lab'

import { SessionDetailsContext } from './context'

const StyledDetailsMap = styled.div`
  margin-top: 20px;
  img {
    max-width: 100%;
  }
`

function DetailsMap() {
  const { loading, event, course } = useContext(SessionDetailsContext)
  if (loading || !event) {
    return (
      <StyledDetailsMap>
        <Skeleton variant="rect" height={300} />
      </StyledDetailsMap>
    )
  }

  if (!event.courseId || !course) {
    return null
  }
  return <StyledDetailsMap className="map" key={event.courseId}><PageDisplay data={course.pageContent} /></StyledDetailsMap>
  
  // return event.course.map.map((item) => (
  //   <StyledDetailsMap className="map" key={item.title}>
      
  //     {/* <div className="map-title">{item.title}</div>
  //     <img src={item.imageUrl} alt={item.title} /> */}
  //   </StyledDetailsMap>
  // ))
}

export default DetailsMap
