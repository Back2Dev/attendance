import React, { useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { Typography } from '@material-ui/core'

import { JobsDetailsContext } from './context'

const StyledJobHistory = styled.div`
  margin-bottom: 10px;
  border: 1px solid #cccccc;
  padding: 5px 10px;
  border-radius: 5px;
`

function JobHistory() {
  const { item } = useContext(JobsDetailsContext)

  const renderHistoryItems = () => {
    if (!item?.history?.length) {
      return null
    }
    return item.history.map((h) => {
      return (
        <div className="item" key={h.createdAt.toString()}>
          <div className="created">
            {moment(h.createdAt).format('ddd Do MMM, h:mm a')} - {h.description}
          </div>
        </div>
      )
    })
  }

  return (
    <StyledJobHistory>
      <Typography variant="h4">History</Typography>
      <div className="items-container">{renderHistoryItems()}</div>
    </StyledJobHistory>
  )
}

export default JobHistory
