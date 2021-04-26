import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Paper, Typography, Button } from '@material-ui/core'

import { MySessionsContext } from './contexts.js'
import SessionItem from './item.js'

const StyledUpcomingSessions = styled.div`
  .sessions-container {
    margin: 20px 0;
    padding: 10px;
  }
  .button-wrapper {
    text-align: center;
  }
`

function UpcomingSessions() {
  const { upcomingSessionsWData } = useContext(MySessionsContext)
  console.log(upcomingSessionsWData)

  const { push } = useHistory()

  const renderSessions = () => {
    if (!upcomingSessionsWData?.length) {
      return <div className="empty">There is no item in the list</div>
    }
    return upcomingSessionsWData.map((item) => <SessionItem item={item} key={item._id} />)
  }

  return (
    <StyledUpcomingSessions>
      <Typography variant="h2" align="center">
        Upcoming sessions
      </Typography>
      <Paper elevation={1} className="sessions-container">
        {renderSessions()}
      </Paper>
      <div className="button-wrapper">
        <Button variant="contained" color="primary" onClick={() => push('/bookings')}>
          Book a session
        </Button>
      </div>
    </StyledUpcomingSessions>
  )
}

export default UpcomingSessions
