import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Button, Paper, Typography } from '@material-ui/core'

import { MySessionsContext } from './contexts.js'
import SessionItem from './item.js'

const StyledRecentSessions = styled.div`
  .sessions-container {
    margin: 20px 0;
    padding: 10px;
  }
  .header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    h2 {
      flex: 1;
      font-size: 1.4rem;
    }
    button {
    }
  }
`

function RecentSessions() {
  const { recentSessionsWData } = useContext(MySessionsContext)
  console.log(recentSessionsWData)

  const { push } = useHistory()

  const renderSessions = () => {
    if (!recentSessionsWData?.length) {
      return <div className="empty">There is no item in the list</div>
    }
    return recentSessionsWData.map((item) => <SessionItem item={item} key={item._id} />)
  }

  const renderMoreBtn = () => {
    return (
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => push('/bookings/history')}
      >
        More
      </Button>
    )
  }

  return (
    <StyledRecentSessions>
      <div className="header-wrapper">
        <Typography variant="h2">Recent sessions</Typography>
        {renderMoreBtn()}
      </div>
      <Paper elevation={1} className="sessions-container">
        {renderSessions()}
      </Paper>
    </StyledRecentSessions>
  )
}

export default RecentSessions
