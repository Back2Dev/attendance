import React, { useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { useConfirm } from '/imports/ui/components/commons/confirm-box.js'

import {
  Paper,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { BookingsContext } from './context.js'

const StyledEventItem = styled(Paper)`
  padding: 10px 20px;
  margin-top: 20px;

  .item-wrapper {
    display: flex;
  }
  .left-col {
    flex: 1;
    .event-date {
      font-weight: bold;
      font-size: 1.3rem;
    }
    .event-name {
      font-weight: bold;
      font-size: 1.3rem;
    }
    .course-info {
      .course-name {
        font-size: 1.2rem;
      }
      &.backup {
        .course-name {
          opacity: 0.7;
        }
      }
    }
  }
  .right-col {
    display: flex;
    align-items: center;

    .add-tool-btn {
      margin-left: 8px;
    }
    .cancel-btn {
      margin-left: 8px;
    }
    .book-btn {
      margin-left: 8px;
    }
  }
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
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
      .item-wrapper {
        display: block;
      }
      .right-col {
        flex-direction: row;
        justify-content: flex-end;
      }
    }
  `}
`

function EventItem({ event }) {
  const { when, name, tools, course, backupCourse, members } = event
  const { book, cancel, submiting } = useContext(BookingsContext)
  const { member: myMember } = useContext(AccountContext)

  const { showConfirm } = useConfirm()

  const [displayTools, setDisplayTools] = useState(false)
  const [selectedTool, setSelectedTool] = useState('')

  const session = useMemo(() => {
    let foundSession
    if (!myMember?._id) {
      return foundSession
    }
    members?.map((item) => {
      if (item._id === myMember._id) {
        foundSession = item.session
      }
    })
    return foundSession
  }, [myMember?._id, members])

  const onBookBtnClick = () => {
    if (!tools?.length) {
      // no option for tools selection, just call book function
      book({ eventId: event._id, toolId: selectedTool || null })
      return
    }
    // check if the tools block are displayed already
    if (!displayTools) {
      setDisplayTools(true)
      return
    }
    // finally just book the event
    book({ eventId: event._id, toolId: selectedTool || null })
    setDisplayTools(false)
  }

  const onCancel = () => {
    cancel({ sessionId: session._id })
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
    const { status, toolName } = session
    if (status !== 'booked' || !toolName) {
      return null
    }
    return ` + ${toolName}`
  }

  const renderCancelBtn = () => {
    if (!session) {
      return null
    }
    if (session.status !== 'booked') {
      return null
    }
    return (
      <Button
        className="cancel-btn"
        variant="contained"
        startIcon={<CloseIcon />}
        color="secondary"
        onClick={() => {
          showConfirm({
            onConfirm: onCancel,
            title: 'Are you sure?',
            message: `You're going to cancel booked event: ${name}`,
          })
        }}
        disabled={submiting}
      >
        Cancel
      </Button>
    )
  }

  const renderBookBtn = () => {
    if (session) {
      return null
    }
    return (
      <Button
        className="book-btn"
        variant="contained"
        onClick={onBookBtnClick}
        disabled={submiting}
      >
        Book
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
            <FormControlLabel
              value=""
              control={<Radio />}
              label="None"
              labelPlacement="end"
            />
            {tools.map((tool) => (
              <FormControlLabel
                key={tool._id}
                value={tool._id}
                control={<Radio />}
                label={tool.name}
                labelPlacement="end"
                disabled={tool.available === false}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  const renderCourse = () => {
    if (!course) {
      return null
    }
    return (
      <div className="course-info">
        <div className="course-name">Course: {course?.title}</div>
      </div>
    )
  }

  const renderBackupCourse = () => {
    if (!backupCourse) {
      return null
    }
    return (
      <div className="course-info backup">
        <div className="course-name">Backup course: {backupCourse?.title}</div>
      </div>
    )
  }

  return (
    <StyledEventItem elevation={1}>
      <div className="item-wrapper">
        <div className="left-col">
          <div>
            <span className="event-date">{moment(when).format('ddd D MMM')},</span>{' '}
            <span className="event-name">{name}</span>
          </div>
          {renderCourse()}
          {renderBackupCourse()}
        </div>
        <div className="right-col">
          {renderStatus()}
          {renderTool()}
          {renderCancelBtn()}
          {renderListOfTools()}
          {renderBookBtn()}
        </div>
      </div>
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
    backupCourse: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        session: PropTypes.shape({
          _id: PropTypes.string,
          memberId: PropTypes.string,
          status: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
}

export default EventItem
