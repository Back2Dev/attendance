import React from 'react'
import styled from 'styled-components'

import { Button, Typography } from '@material-ui/core'

const StyledJobActions = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: top;
  .left {
    button {
      margin-right: 10px;
    }
  }
  .right {
    button {
      margin-left: 10px;
      margin-bottom: 5px;
    }
  }
`

function JobActions() {
  return (
    <StyledJobActions>
      <div className="left">
        <Button variant="contained">Start</Button>
      </div>
      <div className="right">
        <Button variant="contained">Mark as paid</Button>
        <Button variant="contained">Call</Button>
        <Button variant="contained">SMS</Button>
      </div>
    </StyledJobActions>
  )
}

export default JobActions
