import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'

const StyledEventItem = styled.div`
  .item-wrapper {
    display: flex;
  }
  .left-col {
    flex: 1;
  }
  .right-col {
  }
  .list-tools-wrapper {
  }
`

function EventItem({ event }) {
  const { when, name, session, tools } = event

  const [displayTools, setDisplayTools] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  const renderStatus = () => {
    if (!session) {
      return null
    }
    return session.status
  }

  const renderTool = () => {
    return 'selected tool'
  }

  const renderCancelBtn = () => {
    return null
  }

  const renderBookBtn = () => {
    return 'book btn'
  }

  const renderAddToolBtn = () => {
    return (
      <Button
        className="add-tool-btn"
        variant="contained"
        onClick={() => setDisplayTools(true)}
      >
        Add equipment
      </Button>
    )
  }

  const renderListOfTools = () => {
    if (!tools?.length) {
      return null
    }
    return (
      <div className="tools-container">
        <FormControl component="fieldset">
          <FormLabel component="legend">Add equipment</FormLabel>
          <RadioGroup
            aria-label="gender"
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
              labelPlacement="right"
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Male"
              labelPlacement="right"
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label="Other"
              labelPlacement="right"
            />
            <FormControlLabel
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
              labelPlacement="right"
            />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  return (
    <StyledEventItem>
      <div className="item-wrapper">
        <div className="left-col">
          <div>
            <span className="event-date">{moment(event.when).format('ddd D MMM')}</span>{' '}
            <span className="event-name">{event.name}</span>
          </div>
          <div className="course-info">some course name and coach name</div>
        </div>
        <div className="right-col">
          {renderStatus()}
          {renderTool()}
          {renderCancelBtn()}
          {renderBookBtn()}
          {renderAddToolBtn()}
        </div>
      </div>
      <div className="list-tools-wrapper">{renderListOfTools()}</div>
    </StyledEventItem>
  )
}

export default EventItem
