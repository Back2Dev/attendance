import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import { ServiceContext } from './context'
import SearchBox from '../../commons/search-box'
import Loading from '../../commons/loading'
import Avatar from '../../commons/avatar'

const StyledContactStep = styled.div`
  .search-box {
    margin-top: 20px;
  }
  .matches-container {
    margin-top: 20px;
    padding: 10px 20px;
    .list-item {
      &.selected {
        background-color: #e6e6e6;
      }
    }
  }
  .selected-member {
    margin-top: 20px;
    padding: 10px 20px;
  }
`

function contactStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setItems':
      return { ...state, items: payload, updatedAt: new Date() }
    case 'setSearching':
      return { ...state, searching: payload }
    case 'setMembers':
      return { ...state, foundMembers: payload, searching: false }
    case 'selectMember':
      return { ...state, selectedMember: payload }
    case 'clear':
      return { ...state, foundMembers: [], selectedMember: null }
    default:
      return state
  }
}

function ContactStep({ initialData }) {
  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [state, dispatch] = useReducer(contactStepReducer, {
    items: initialData?.items || [],
    updatedAt: new Date(),
    hasValidData: true,
    checkedAt: null,
    searching: false,
    foundMembers: [],
    selectedMember: null,
  })

  const { setStepData, activeStep } = useContext(ServiceContext)
  const checkTimeout = useRef(null)

  const {
    items,
    hasValidData,
    checkedAt,
    updatedAt,
    searching,
    foundMembers,
    selectedMember,
  } = state

  const checkData = async () => {
    // TODO: do something here
    dispatch({ type: 'setHasValidData', payload: true })
  }

  useEffect(() => {
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    setStepData({
      items,
      updatedAt,
      hasValidData,
    })
  }, [checkedAt])

  const searchTimeout = useRef(null)
  const searchMember = (keyword) => {
    Meteor.clearTimeout(searchTimeout.current)
    searchTimeout.current = Meteor.setTimeout(() => {
      // only search when the keyword is long enough
      if (keyword.length < 3) {
        dispatch({ type: 'clear' })
        return
      }
      dispatch({ type: 'setSearching', payload: true })
      Meteor.call('members.search', { keyword }, (error, result) => {
        if (!mounted.current) {
          return
        }
        if (error) {
          showError(error.message)
          dispatch({ type: 'setSearching', payload: false })
          return
        }
        if (result) {
          dispatch({ type: 'setMembers', payload: result.members })
        }
      })
    }, 500)
  }

  if (activeStep !== 'contact') {
    return null
  }

  const classes = ['contactstep-item-form']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  const renderFoundMembers = () => {
    if (foundMembers.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="No member was found with keyword" secondary="" />
        </ListItem>
      )
    }
    return foundMembers.map((item) => {
      const isSelected = selectedMember && selectedMember._id === item._id
      return (
        <ListItem
          key={item._id}
          button
          onClick={() => {
            dispatch({ type: 'selectMember', payload: item })
          }}
          className={`list-item ${isSelected ? 'selected' : ''}`}
        >
          <ListItemAvatar>
            <Avatar
              url={item.avatar}
              alt={item.name}
              linkUrl={`/profile/${item._id}`}
              size={45}
            />
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            secondary={`${item.mobile || ''}${item.email ? ` - ${item.email}` : ''}`}
          />
        </ListItem>
      )
    })
  }

  const renderSelectedMember = () => {
    if (!selectedMember) {
      return null
    }
    const { name, mobile, email } = selectedMember
    return (
      <Paper elevation={3} className="selected-member">
        <Typography variant="h3">Selected Member</Typography>
        <div className="name">{name}</div>
        <div className="info">
          {mobile} {email ? `- ${email}` : ''}
        </div>
      </Paper>
    )
  }

  return (
    <StyledContactStep>
      <div className={classes.join(' ')}>
        <SearchBox
          onChange={(value) => searchMember(value)}
          placeholder="search existing member"
        />
        <Paper elevation={3} className="matches-container">
          <Loading loading={searching} />
          <Typography variant="h3">Matches</Typography>
          <List className="list-container">{renderFoundMembers()}</List>
        </Paper>
        {renderSelectedMember()}
      </div>
    </StyledContactStep>
  )
}

ContactStep.propTypes = {
  initialData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
  }),
}

ContactStep.defaultProps = {
  initialData: null,
}

export default ContactStep
