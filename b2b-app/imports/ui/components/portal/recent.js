import React, { useContext } from 'react'
import styled from 'styled-components'
import { Button, Paper, Typography } from '@mui/material'

import { MySessionsContext } from './contexts.js'
import SessionItem from './item.js'
import useHistory from '/imports/ui/utils/history'

const StyledRecentBookings = styled.div`
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

function RecentBookings() {
  const { recentBookingsWData } = useContext(MySessionsContext)
  // console.log(recentBookingsWData)

  const { push } = useHistory()

  const renderBookings = () => {
    if (!recentBookingsWData?.length) {
      return <div className="empty">You have no session history</div>
    }
    return recentBookingsWData.map((item) => <SessionItem item={item} key={item._id} />)
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
    <StyledRecentBookings>
      <div className="header-wrapper">
        <Typography variant="h2">Recent sessions</Typography>
        {renderMoreBtn()}
      </div>
      <Paper elevation={1} className="sessions-container">
        {renderBookings()}
      </Paper>
    </StyledRecentBookings>
  )
}

export default RecentBookings
