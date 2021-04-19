import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
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

import { BookingsContext } from './context.js'

const StyledEventItem = styled.div`
  .item-wrapper {
    display: flex;
  }
  .left-col {
    flex: 1;
  }
  .right-col {
    .add-tool-btn {
      margin-left: 8px;
    }
  }
  .list-tools-wrapper {
    .tools-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      .MuiFormControl-root {
        border: 1px solid #cccccc;
        .MuiFormLabel-root {
          margin-left: 20px;
          padding: 5px;
        }
        .MuiFormGroup-root {
          flex-direction: row;
          padding: 0 10px;
        }
      }
    }
  }
`

function EventItem({ event }) {
  const { when, name, session, tools, course, coach } = event
  const { book, submiting } = useContext(BookingsContext)

  const [displayTools, setDisplayTools] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  const onBook = () => {
    book({ eventId: event._id, tools: selectedTool ? [selectedTool] : [] })
  }

  const renderStatus = () => {
    if (!session) {
      return null
    }
    return session.status
  }

  const renderTool = () => {
    if (!session) {
      return null
    }
    return 'selected tool'
  }

  const renderCancelBtn = () => {
    if (!session) {
      return null
    }
  }

  const renderBookBtn = () => {
    if (session) {
      return null
    }
    return (
      <Button
        className="book-btn"
        variant="contained"
        onClick={onBook}
        disabled={submiting}
      >
        Book
      </Button>
    )
  }

  const renderAddToolBtn = () => {
    if (session) {
      return null
    }
    return (
      <Button
        className="add-tool-btn"
        variant="contained"
        onClick={() => {
          if (displayTools) {
            setSelectedTool(null)
          }
          setDisplayTools(!displayTools)
        }}
      >
        {!displayTools ? 'Add equipment' : 'Cancel'}
      </Button>
    )
  }

  const renderListOfTools = () => {
    if (session) {
      return null
    }
    if (!tools?.length) {
      return null
    }
    if (!displayTools) {
      return null
    }
    // TODO: handle disabled tools
    return (
      <div className="tools-container">
        <FormControl component="fieldset">
          <FormLabel component="legend">Add equipment</FormLabel>
          <RadioGroup
            aria-label="tool"
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
          >
            {tools.map((tool) => (
              <FormControlLabel
                key={tool._id}
                value={tool._id}
                control={<Radio />}
                label={tool.name}
                labelPlacement="end"
              />
            ))}
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
            <span className="event-date">{moment(when).format('ddd D MMM')}</span>{' '}
            <span className="event-name">{name}</span>
          </div>
          <div className="course-info">
            <div className="course-name">{course?.title}</div>
            <div className="coach-name">{coach?.name}</div>
          </div>
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

EventItem.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    when: PropTypes.instanceOf(Date).isRequired,
    name: PropTypes.string.isRequired,
    session: PropTypes.object,
    tools: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    course: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    coach: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default EventItem
