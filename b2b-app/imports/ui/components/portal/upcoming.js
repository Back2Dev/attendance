import React, { useContext } from 'react'
import styled from 'styled-components'
import { Paper, Typography, Button } from '@mui/material'

import { MySessionsContext } from './contexts.js'
import SessionItem from './item.js'
import useHistory from '/imports/ui/utils/history'

const StyledUpcomingBookings = styled.div`
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

function UpcomingBookings() {
  const { upcomingBookingsWData } = useContext(MySessionsContext)
  // console.log(upcomingBookingsWData)

  const { push } = useHistory()

  const renderBookings = () => {
    if (!upcomingBookingsWData?.length) {
      return <div className="empty">You do not have any future bookings</div>
    }
    return upcomingBookingsWData.map((item) => <SessionItem item={item} key={item._id} />)
  }

  return (
    <StyledUpcomingBookings>
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
        {renderBookings()}
      </Paper>
    </StyledUpcomingBookings>
  )
}

export default UpcomingBookings
