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

function UpcomingSessions() {
  const { upcomingSessionsWData } = useContext(MySessionsContext)
  console.log(upcomingSessionsWData)

  const { push } = useHistory()

  const renderSessions = () => {
    if (!upcomingSessionsWData?.length) {
      return <div className="empty">You do not have any future bookings</div>
    }
    return upcomingSessionsWData.map((item) => <SessionItem item={item} key={item._id} />)
  }

  return (
    <StyledUpcomingSessions>
      <div className="header-wrapper">
        <Typography variant="h2">Upcoming sessions</Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => push('/bookings')}
        >
          Book a session
        </Button>
      </div>
      <Paper elevation={1} className="sessions-container">
        {renderSessions()}
      </Paper>
    </StyledUpcomingSessions>
  )
}

export default UpcomingSessions
