import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  Switch,
  FormControlLabel,
  Link,
} from '@material-ui/core'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import { ServiceContext } from './context'
import SearchBox from '../../commons/search-box'
import Loading from '../../commons/loading'
import Avatar from '../../commons/avatar'
import moment from 'moment'
import CONSTANTS from '../../../../api/constants'
import numeral from 'numeral'

const StyledContactStep = styled.div`
  margin: 20px 0;
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
    margin: 0 auto;
  }
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .history-item {
    margin-bottom: 10px;
    .item-date {
      font-weight: bold;
    }
    .item-data {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .data {
        margin-right: 10px;
      }
    }
  }
`

const memberFormSchema = new SimpleSchema({
  name: String,
  mobile: { type: String, optional: true },
  email: { type: String, optional: true },
  address: String,
})
memberFormSchema.addDocValidator((obj) => {
  // console.log('doc validator', obj)
  if (!obj?.mobile && !obj?.email) {
    return [
      { name: 'mobile', type: 'required', value: 'Mobile or Email is required' },
      { name: 'email', type: 'required', value: 'Mobile or Email is required' },
    ]
  }
  return []
})

function contactStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setHasMember':
      return { ...state, hasMember: payload }
    case 'setSearching':
      return { ...state, searching: payload }
    case 'setMembers':
      return { ...state, foundMembers: payload, searching: false }
    case 'selectMember':
      // console.log('selectMember', state.selectedMember, payload)
      return {
        ...state,
        selectedMember: payload,
        memberData: payload,
        updatedAt: new Date(),
      }
    case 'deselectMember':
      return { ...state, selectedMember: null, memberData: {}, updatedAt: new Date() }

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

function ContactStep() {
  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [state, dispatch] = useReducer(contactStepReducer, {
    updatedAt: null,
    hasValidData: false,
    checkedAt: null,
    hasMember: true,
    searching: false,
    foundMembers: [],
    selectedMember: null,
    memberData: {},
  })

  const {
    setStepData,
    activeStep,
    goBack,
    goNext,
    setStepProperty,
    originalData,
  } = useContext(ServiceContext)
  const checkTimeout = useRef(null)
  const formRef = useRef()

  const {
    hasValidData,
    checkedAt,
    updatedAt,
    hasMember,
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
    if (originalData) {
      console.log('originalData', originalData)
      if (originalData.memberId) {
        dispatch({
          type: 'selectMember',
          payload: {
            _id: originalData.memberId,
            name: originalData.name || '',
            mobile: originalData.phone || '',
            email: originalData.email || '',
            address: originalData.address || '',
          },
        })
        dispatch({ type: 'setHasValidData', payload: true })
      } else {
        dispatch({ type: 'setHasMember', payload: false })
      }
    }
  }, [originalData])

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
    // if (activeStep !== 'contact') {
    //   return
    // }
    setStepData({
      stepKey: 'contact',
      data: {
        hasMember,
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
            if (state.selectedMember?._id === item._id) {
              dispatch({ type: 'deselectMember' })
            } else {
              dispatch({ type: 'selectMember', payload: item })
            }
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

  const renderMemberHistory = () => {
    if (!selectedMember || selectedMember.history?.length < 1) {
      return null
    }
    return selectedMember.history?.map((item) => {
      return (
        <div key={item._id} className="history-item">
          <div className="item-date">
            <Link component={RouterLink} to={`services/${item._id}`}>
              {moment(item.createdAt).format('DD MMM YYYY')}
            </Link>
          </div>
          <div className="item-data">
            <div className="data bike-info">
              {item.color} {item.make} {item.model},
            </div>
            <div className="data cost">
              Cost: ${numeral(item.totalCost / 100).format('0,0')},
            </div>
            <div className="data status">
              Status: {CONSTANTS.JOB_STATUS_READABLE[item.status]}
            </div>
          </div>
        </div>
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
        <div className="history-container">{renderMemberHistory()}</div>
      </Paper>
    )
  }

  const renderMemberForm = () => {
    if (!hasMember) {
      return (
        <div className="btns-container">
          <Button onClick={goBack}>Back</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setStepData({
                stepKey: 'contact',
                data: {
                  hasMember,
                },
              })
              setStepProperty({
                stepKey: 'contact',
                property: 'completed',
                value: true,
              })
              goNext()
            }}
          >
            Next
          </Button>
        </div>
      )
    }

    return (
      <>
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
      </>
    )
  }

  return (
    <StyledContactStep>
      <div className={classes.join(' ')}>
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={hasMember}
                onChange={() => {
                  dispatch({ type: 'setHasMember', payload: !hasMember })
                }}
                color="primary"
              />
            }
            label="Has Member"
          />
        </div>
        {renderMemberForm()}
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
