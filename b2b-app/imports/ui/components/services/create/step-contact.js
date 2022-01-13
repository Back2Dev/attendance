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
  IconButton,
} from '@material-ui/core'

import PersonAddIcon from '@material-ui/icons/PersonAdd'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorsField } from 'uniforms-material'

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

  .decision-marking-container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .search-box {
      flex: 1;
      margin-right: 5px;
      input {
        padding: 10px 0;
      }
    }
    .refurbish-btn {
      margin-right: 5px;
    }
    .new-member-btn {
      padding: 6px;
      min-width: unset;
    }
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
    margin: 20px auto 10px;

    .form-title {
      font-weight: bold;
    }
  }
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .history-container {
    .history-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .history-item {
      margin-bottom: 10px;
      border: 1px solid #cccccc;
      border-radius: 5px;
      padding: 5px;
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
  }
`

const memberFormSchema = new SimpleSchema({
  name: String,
  mobile: { type: String, optional: false },
  email: { type: String, optional: true },
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
    case 'setRefurbish':
      return {
        ...state,
        refurbish: payload,
        showNewMemberForm: payload ? false : state.showNewMemberForm,
        updatedAt: new Date(),
      }
    case 'cancelForm':
      return {
        ...state,
        showNewMemberForm: false,
        selectedMember: null,
        memberData: {},
        updatedAt: new Date(),
      }
    case 'setShowNewMemberForm':
      return payload === true
        ? {
            ...state,
            showNewMemberForm: payload,
            refurbish: false,
          }
        : {
            name: '',
            mobile: '',
            email: '',
          }
    case 'setSearching':
      return { ...state, searching: payload }
    case 'setMembers':
      return {
        ...state,
        foundMembers: payload.members,
        keyword: payload.keyword,
        searching: false,
      }
    case 'selectMember':
      // console.log('selectMember', state.selectedMember, payload)
      return {
        ...state,
        selectedMember: payload,
        memberData: payload,
        updatedAt: new Date(),
      }
    case 'deselectMember':
      // console.log('deselectMember')
      return { ...state, selectedMember: null, memberData: {}, updatedAt: new Date() }

    case 'clear':
      // console.log('clear')
      return {
        ...state,
        foundMembers: [],
        selectedMember: null,
        // memberData: {},
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
  const searchBoxRef = useRef()

  useEffect(() => () => (mounted.current = false), [])

  const [state, dispatch] = useReducer(contactStepReducer, {
    updatedAt: null,
    hasValidData: false,
    checkedAt: null,
    refurbish: false,
    showNewMemberForm: false,
    searching: false,
    keyword: '',
    foundMembers: [],
    selectedMember: null,
    memberData: {},
  })

  const {
    setStepData,
    activeStep,
    createJob,
    setStepProperty,
    originalData,
    goBack,
  } = useContext(ServiceContext)
  const checkTimeout = useRef(null)
  const formRef = useRef()

  const {
    hasValidData,
    checkedAt,
    updatedAt,
    refurbish,
    showNewMemberForm,
    keyword,
    foundMembers,
    selectedMember,
    memberData,
  } = state

  const checkData = async () => {
    if (refurbish) {
      dispatch({ type: 'setHasValidData', payload: true })
      return true
    }
    console.log('checkData', memberData)
    const checkResult = await formRef.current?.validateModel(memberData)
    console.log('checkResult', checkResult)
    dispatch({
      type: 'setHasValidData',
      payload: checkResult === null || checkResult === undefined,
    })
    return checkResult === null
  }

  useEffect(() => {
    if (originalData) {
      // console.log('originalData effect', originalData)
      if (originalData.memberId) {
        dispatch({
          type: 'selectMember',
          payload: {
            _id: originalData.memberId,
            name: originalData.name || '',
            mobile: originalData.phone || '',
            email: originalData.email || '',
          },
        })
        dispatch({ type: 'setHasValidData', payload: true })
      } else {
        dispatch({ type: 'setRefurbish', payload: true })
      }
    }
  }, [originalData])

  useEffect(() => {
    if (!updatedAt) {
      return
    }
    // console.log('check data effect', memberData)
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    // if (activeStep !== 'contact') {
    //   return
    // }
    // console.log('checkedAt effect')
    setStepData({
      stepKey: 'contact',
      data: {
        refurbish,
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

  const searchTimeout = useRef(null)
  const searchMember = (keyword) => {
    Meteor.clearTimeout(searchTimeout.current)
    searchTimeout.current = Meteor.setTimeout(() => {
      // only search when the keyword is long enough
      if (keyword.length < 1) {
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
          dispatch({ type: 'setMembers', payload: { members: result.members, keyword } })
        }
      })
    }, 500)
  }

  const handleSubmit = async () => {
    const checkResult = await checkData()
    if (checkResult) {
      console.log('create job')
      try {
        createJob()
      } catch (e) {
        showError(`Error creating job: ${e.message}`)
      }
    } else {
      console.log('something wrong')
    }
  }

  if (activeStep !== 'contact') {
    return null
  }

  const classes = ['contactstep-item-form']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  const renderFoundMembers = () => {
    if (refurbish || showNewMemberForm) {
      return null
    }
    if (selectedMember) {
      return null
    }
    if (keyword && foundMembers?.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="No member was found with keyword" secondary="" />
        </ListItem>
      )
    }
    return foundMembers?.map((item) => {
      const isSelected = selectedMember && selectedMember._id === item._id
      return (
        <ListItem
          key={item._id}
          button
          onClick={() => {
            if (state.selectedMember?._id === item._id) {
              dispatch({ type: 'deselectMember' })
            } else {
              // searchBoxRef.current.clear()
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
    if (refurbish || !selectedMember || selectedMember.history?.length < 1) {
      return null
    }
    return (
      <div className="history-container">
        <div className="history-title">Service history</div>
        {selectedMember.history?.map((item) => {
          return (
            <div key={item._id} className="history-item">
              <div className="item-date">
                <Link component={RouterLink} to={`../services/${item._id}`}>
                  {moment(item.createdAt).format('DD MMM YYYY')}
                </Link>
              </div>
              <div className="item-data">
                <div className="data bike-info">{item.bikeName},</div>
                <div className="data cost">
                  Cost: ${numeral(item.totalCost / 100).format('0,0')},
                </div>
                <div className="data status">
                  Status: {CONSTANTS.JOB_STATUS_READABLE[item.status]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMemberForm = () => {
    if (refurbish || (!showNewMemberForm && !selectedMember)) {
      return null
    }

    return (
      <div className="form-container">
        <div className="form-title">
          {showNewMemberForm ? 'New customer' : 'Selected customer'}
        </div>
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
          <AutoField name="name" variant="outlined" />
          <AutoField name="mobile" variant="outlined" />
          <AutoField name="email" variant="outlined" />
          <ErrorsField />
          <div className="btns-container">
            <Button
           data-cy="back"
              onClick={() => {
                goBack()
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: 'cancelForm' })
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                formRef.current.submit()
              }}
              data-cy="submit"
              disabled={!hasValidData}
            >
              Submit
            </Button>
          </div>
        </AutoForm>
      </div>
    )
  }

  const renderRefurbishForm = () => {
    if (!refurbish) {
      return null
    }
    return (
      <div className="btns-container">
        <Button
        data-cy="back"
          onClick={() => {
            goBack()
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          data-cy="submit"
          onClick={() => {
            handleSubmit()
          }}
        >
          Submit
        </Button>
      </div>
    )
  }

  return (
    <StyledContactStep>
      <div className={classes.join(' ')}>
        <div className="decision-marking-container" data-cy="customer-search">
          <SearchBox
            ref={searchBoxRef}
            className="member-search-box"
            variant="outlined"
            defaultValue={memberData?.name}
            onChange={(value) => searchMember(value)}
            placeholder="search for customer"
            autoTrigger
            disabled={refurbish || showNewMemberForm || !!selectedMember}
          />

          <Button
            className="refurbish-btn"
            variant="contained"
            color={refurbish ? 'primary' : 'default'}
            onClick={() => {
              dispatch({ type: 'setRefurbish', payload: !refurbish })
            }}
            disabled={showNewMemberForm || selectedMember}
          >
            Refurbish
          </Button>
          <Button
            className="new-member-btn"
            variant="contained"
            color={showNewMemberForm ? 'primary' : 'default'}
            onClick={() => {
              dispatch({ type: 'setShowNewMemberForm', payload: true })
            }}
            disabled={refurbish || selectedMember}
          >
            <PersonAddIcon />
          </Button>
        </div>
        {renderFoundMembers()}
        {renderMemberForm()}
        {renderMemberHistory()}
        {renderRefurbishForm()}
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
