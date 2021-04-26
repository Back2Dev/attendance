import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

const StyledSessionItem = styled.div`
  margin-bottom: 20px;
  .session-info {
    font-size: 1.2rem;
  }
  .selected-tool,
  .status {
    padding-left: 10px;
  }
`

function SessionItem({ item }) {
  const { bookedDate, name, toolName, status } = item

  const renderSelectedTool = () => {
    if (!toolName) {
      return null
    }
    return (
      <div className="selected-tool">
        <div className="tool">Tool: {toolName}</div>
      </div>
    )
  }

  const renderStatus = () => {
    if (status === 'booked') {
      return null
    }
    return <div className="status">Status: {status}</div>
  }

  return (
    <StyledSessionItem>
      <div className="session-info">
        <span className="date">{moment(bookedDate).format('ddd DD MMM ha')}, </span>
        <span className="title">{name}</span>
      </div>
      {renderSelectedTool()}
      {renderStatus()}
    </StyledSessionItem>
  )
}

SessionItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    bookedDate: PropTypes.instanceOf(Date),
    toolName: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
}

export default SessionItem
