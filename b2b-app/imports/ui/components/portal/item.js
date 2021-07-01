import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import { useHistory } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'

const StyledSessionItem = styled.div`
  margin-bottom: 20px;
  .session-info {
    font-size: 1.2rem;
  }
  .selected-tool,
  .status {
    padding-left: 10px;
  }
  .status {
    cursor: pointer;
  }
`

function SessionItem({ item }) {
  const { _id, bookedDate, name, toolName, status } = item

  const { push } = useHistory()

  const handleClick = () => {
    push(`/sessions/${_id}`)
  }

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
    // if (status === 'booked') {
    //   return null
    // }
    return (
      <div className="status" onClick={handleClick}>
        Status: {status}
      </div>
    )
  }

  return (
    <StyledSessionItem>
      <div className="session-info">
        <Link component={RouterLink} to={`/sessions/${_id}`}>
          <span className="date">{moment(bookedDate).format('ddd DD MMM ha')}, </span>
          <span className="title">{name}</span>
        </Link>
      </div>
      {renderSelectedTool()}
      {renderStatus()}
    </StyledSessionItem>
  )
}

SessionItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    bookedDate: PropTypes.instanceOf(Date),
    toolName: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
}

export default SessionItem
