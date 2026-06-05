import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connectField, useForm } from 'uniforms'
import {
  Switch,
  FormControlLabel,
  Select,
  Input,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material'
import styled from 'styled-components'
import moment from 'moment'

const StyledEventRepeat = styled.div`
  margin: 10px 0;
  .input-every {
    width: 50px;
    input {
      text-align: center;
    }
  }
  .MuiSelect-selectMenu {
    min-height: 1em;
  }
  .repeat-option {
    margin: 10px 0;
  }
  .dow-options {
    button {
      width: 35px;
      height: 35px;
      min-width: unset;
      padding: 0;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .repeat-ends {
    margin: 10px 0;
    .inline-radio-label {
      span {
        margin-right: 10px;
      }
      &.on {
        input {
          width: 160px;
        }
      }
      &.after {
        input {
          width: 50px;
        }
      }
    }
  }
`

const EventRepeat = ({ className, disabled, onChange, value = {}, label }) => {
  const formContext = useForm()
  // console.log('selected date', formContext.model.when, formContext.model.repeat)

  const [factor, setFactor] = useState(value?.factor ? value.factor : 'week')
  const [every, setEvery] = useState(value?.every || 1)
  const [dow, setDow] = useState(value?.dow || [])
  const [dom, setDom] = useState(value?.dom || null)
  const [util, setUtil] = useState(value?.util || null)

  const [endsOpt, setEndsOpt] = useState('on')
  const [endsAfter, setEndsAfter] = useState(12)
  const [enabled, setEnabled] = useState(!!value?.factor)
  const [changed, setChanged] = useState(null)
  const isMountedRef = useRef(false)

  const dowRef = useRef(dow)
  dowRef.current = dow

  // set dow and dom when the selected date changed
  useEffect(() => {
    if (formContext.model.when) {
      setDom(moment(formContext.model.when).date())
      if (dowRef.current.length === 0) {
        setDow([moment(formContext.model.when).day()])
      }
    }
  }, [formContext.model.when])

  // calculate util date
  useEffect(() => {
    if (endsOpt === 'after' && endsAfter) {
      // console.log('update util')
      setUtil(
        moment(formContext.model.when)
          .add(every * endsAfter, factor)
          .toDate()
      )
      setChanged(new Date())
    }
  }, [factor, every, endsOpt, endsAfter])

  // update the field value — skip on mount, only fire when user changes something
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (!enabled) {
      onChange(undefined)
      return
    }
    onChange({
      factor,
      every,
      dow,
      dom,
      util,
    })
  }, [changed])

  const toggleDow = (d) => {
    const newDow = dow.filter((item) => item !== d)
    if (dow.indexOf(d) === -1) {
      newDow.push(d)
    }
    setDow(newDow)
    setChanged(new Date())
  }

  const handleEndsChange = (event) => {
    // console.log(event.target.value)
    setEndsOpt(event.target.value)
    setChanged(new Date())
  }

  const renderSwitch = () => {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={() => {
              setEnabled(!enabled)
              setChanged(new Date())
            }}
            color="primary"
          />
        }
        label="Repeat"
      />
    )
  }

  const getDowLabel = (i) => {
    switch (i) {
      case 1:
        return 'M'
      case 2:
        return 'T'
      case 3:
        return 'W'
      case 4:
        return 'T'
      case 5:
        return 'F'
      case 6:
        return 'S'
      case 0:
        return 'S'
      default:
        return 'N/A'
    }
  }

  const renderWeeklyOption = () => {
    if (factor !== 'week') {
      return null
    }
    const days = []
    for (let i = 0; i < 7; i += 1) {
      // start with monday
      const k = i < 6 ? i + 1 : 0
      days.push({
        dow: k,
        selected: dow.indexOf(k) !== -1,
      })
    }

    return (
      <div className="dow-options">
        {days.map((d) => (
          <Button
            key={d.dow}
            variant="contained"
            color={d.selected ? 'primary' : 'default'}
            onClick={() => {
              toggleDow(d.dow)
              setChanged(new Date())
            }}
          >
            {getDowLabel(d.dow)}
          </Button>
        ))}
      </div>
    )
  }

  const renderMonthlyOption = () => {
    if (factor !== 'month') {
      return null
    }
    // return <div>monthly option</div>
    return null // for this moment
  }

  const renderEndsOnInput = (
    <div className="inline-radio-label on">
      <span>On</span>
      <Input
        type="date"
        value={moment(util).format('YYYY-MM-DD')}
        onChange={(event) => {
          setUtil(moment(event.target.value).toDate())
          setChanged(new Date())
        }}
        disabled={endsOpt !== 'on'}
      />
    </div>
  )

  const renderEndsAfterInput = (
    <div className="inline-radio-label after">
      <span>After</span>
      <Input
        type="number"
        value={endsAfter}
        onChange={(event) => {
          setEndsAfter(parseInt(event.target.value))
          setChanged(new Date())
        }}
        disabled={endsOpt !== 'after'}
      />{' '}
      occurrences
    </div>
  )

  const renderRecurrenceForm = () => {
    if (!enabled) {
      return null
    }
    return (
      <div>
        <div>
          Repeat every{' '}
          <Input
            className="input-every"
            type="number"
            value={every}
            onChange={(event) => {
              setEvery(event.target.value)
              setChanged(new Date())
            }}
          />{' '}
          <Select
            className="input-factor"
            value={factor}
            onChange={(event) => {
              setFactor(event.target.value)
              setChanged(new Date())
            }}
            margin="dense"
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </div>
        <div className="repeat-option">
          {renderWeeklyOption()}
          {renderMonthlyOption()}
        </div>
        <div className="repeat-ends">
          <FormLabel component="legend">Ends</FormLabel>
          <RadioGroup aria-label="ends" value={endsOpt} onChange={handleEndsChange}>
            <FormControlLabel value="on" control={<Radio />} label={renderEndsOnInput} />
            <FormControlLabel
              value="after"
              control={<Radio />}
              label={renderEndsAfterInput}
            />
          </RadioGroup>
        </div>
      </div>
    )
  }

  return (
    <StyledEventRepeat>
      {renderSwitch()}
      {renderRecurrenceForm()}
    </StyledEventRepeat>
  )
}

EventRepeat.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  // value: PropTypes.shape({
  //   factor: PropTypes.string,
  //   every: PropTypes.number,
  //   dow: PropTypes.number,
  //   dom: PropTypes.number,
  //   util: Date,
  // }),
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const EventRepeatField = connectField(EventRepeat)

export default EventRepeatField
