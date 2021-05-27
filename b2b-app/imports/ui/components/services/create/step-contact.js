import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

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
    h3 {
      margin-bottom: 10px;
    }
    .name {
      font-weight: bold;
    }
  }
  .form-container {
    max-width: 500px;
  }
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
`

const memberFormSchema = new SimpleSchema({
  name: String,
  mobile: String,
  email: String,
  addressPostcode: String,
})

function contactStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setSearching':
      return { ...state, searching: payload }
    case 'setMembers':
      return { ...state, foundMembers: payload, searching: false }
    case 'selectMember':
      if (state.selectedMember?._id === payload._id) {
        return { ...state, selectedMember: null, memberData: {}, updatedAt: new Date() }
      }
      return {
        ...state,
        selectedMember: payload,
        memberData: payload,
        updatedAt: new Date(),
      }
    case 'clear':
      return {
        ...state,
        foundMembers: [],
        selectedMember: null,
        memberData: {},
        updatedAt: new Date(),
      }
    case 'setMemberData':
      return { ...state, memberData: payload, updatedAt: new Date() }
    case 'setHasValidData':
      return { ...state, hasValidData: payload, checkedAt: new Date() }
    default:
      return state
  }
}

function ContactStep({ initialData }) {
  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [state, dispatch] = useReducer(contactStepReducer, {
    updatedAt: null,
    hasValidData: false,
    checkedAt: null,
    searching: false,
    foundMembers: [],
    selectedMember: null,
    memberData: {},
  })

  const { setStepData, activeStep, goBack, goNext, setStepProperty } = useContext(
    ServiceContext
  )
  const checkTimeout = useRef(null)
  const formRef = useRef()

  const {
    hasValidData,
    checkedAt,
    updatedAt,
    searching,
    foundMembers,
    selectedMember,
    memberData,
  } = state

  const checkData = async () => {
    const checkResult = await formRef.current?.validateModel(memberData)
    dispatch({ type: 'setHasValidData', payload: checkResult === null })
    return checkResult === null
  }

  useEffect(() => {
    if (activeStep !== 'contact' || !updatedAt) {
      return
    }

    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    if (activeStep !== 'contact') {
      return
    }
    setStepData({
      stepKey: 'contact',
      data: {
        selectedMember,
        memberData,
        updatedAt,
        hasValidData,
      },
    })
    setStepProperty({
      stepKey: 'contact',
      property: 'completed',
      value: hasValidData,
    })
  }, [checkedAt])

  const handleSubmit = () => {
    checkData()
    if (checkData()) {
      goNext()
    }
  }

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
    return (
      <Paper elevation={3} className="selected-member">
        <Typography variant="h3">
          {selectedMember ? 'Selected Member' : 'New Member'}
        </Typography>
        <div className="form-container">
          <AutoForm
            ref={formRef}
            schema={new SimpleSchema2Bridge(memberFormSchema)}
            model={memberData}
            onSubmit={handleSubmit}
            onChange={(field, data) => {
              const newData = { ...memberData }
              newData[field] = data
              dispatch({ type: 'setMemberData', payload: newData })
            }}
          >
            <AutoFields />
            <ErrorsField />
            <div className="btns-container">
              <Button onClick={goBack}>Back</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  formRef.current.submit()
                }}
                disabled={!hasValidData}
              >
                Submit
              </Button>
            </div>
          </AutoForm>
        </div>
        <div>TODO: render service history here</div>
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
