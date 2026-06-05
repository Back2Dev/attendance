import React, { useContext } from 'react'
import styled from 'styled-components'
import PageDisplay from '/imports/ui/admin/locations/components/page-display'
import { Skeleton } from '@mui/material';

import { SessionDetailsContext } from './context'

const StyledDetailsContent = styled.div`
  margin-top: 20px;
  img {
    width: 100%;
  }
`

function DetailsContent() {
  const { loading, event, course } = useContext(SessionDetailsContext)

  if (loading || !event) {
    return (
      <StyledDetailsContent>
        <Skeleton variant="rectangular" height={300} />
      </StyledDetailsContent>
    );
  }

  return (
    <StyledDetailsContent className="content">
      <PageDisplay data={course.pageContent} course={course} />
    </StyledDetailsContent>
  )
}

export default DetailsContent
