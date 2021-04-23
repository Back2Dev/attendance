import React, { useContext } from 'react'
import styled from 'styled-components'

import { Paper, Typography } from '@material-ui/core'

import { MySessionsContext } from './contexts.js'
import SessionItem from './item.js'

const StyledRecentSessions = styled.div`
  .sessions-container {
    margin: 20px 0;
    padding: 10px;
  }
`

function RecentSessions() {
  const { recentSessionsWData } = useContext(MySessionsContext)
  console.log(recentSessionsWData)

  const renderSessions = () => {
    if (!recentSessionsWData?.length) {
      return <div className="empty">There is no item in the list</div>
    }
    return recentSessionsWData.map((item) => <SessionItem item={item} key={item._id} />)
  }

  return (
    <StyledRecentSessions>
      <Typography variant="h2" align="center">
        Recent sessions
      </Typography>
      <Paper elevation={1} className="sessions-container">
        {renderSessions()}
      </Paper>
    </StyledRecentSessions>
  )
}

export default RecentSessions
